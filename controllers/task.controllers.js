const { sendResponse, AppError } = require("../helpers/utils");
const { validationResult } = require("express-validator");
const ObjectId = require("mongoose").Types.ObjectId;

const Task = require("../models/Task");
const User = require("../models/User");

const taskController = {};

taskController.getTask = async (req, res, next) => {
  const allowedQueries = ["name", "status", "createdAt", "updatedAt"];
  try {
    let tasks = [];
    const keys = Object.keys(req.query);
    if (keys.length !== 0) {
      keys.forEach((item) => {
        if (!allowedQueries.includes(item)) {
          throw new AppError(400, "Queries not allowed", "Get Task Error");
        }
      });
      const { name, status, createdAt, updatedAt } = req.query;
      const query = Task.find({ isDeleted: false });
      if (name) {
        query.where("name").equals(name);
      }
      if (status) {
        query.where("status").equals(status);
      }
      if (createdAt) {
        query.sort({ createdAt: parseInt(createdAt) });
      }
      if (updatedAt) {
        query.sort({ updatedAt: parseInt(updatedAt) });
      }
      query.populate("assignee");

      tasks = await query.exec();
    } else {
      tasks = await Task.find()
        .populate("assignee")
        .sort("-createdAt, -updateAt");
    }
    sendResponse(res, 200, true, tasks, null, "Get Task Successfully");
  } catch (error) {
    next(error);
  }
};

taskController.createTask = async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      const task = await Task.create({ name: name, description: description });
      sendResponse(res, 200, true, task, null, "Create Task Successfully");
    } else {
      const errors = result.array();
      const errorsMsgs = errors.map((item) => item.msg);
      const errorMsgsText = errorsMsgs.join(",");
      throw new AppError(400, `${errorMsgsText}`, "Create Task Error");
    }
  } catch (error) {
    next(error);
  }
};

taskController.getTaskById = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (ObjectId.isValid(id)) {
      if (String(new ObjectId(id)) === id) {
        const task = await Task.findOne({ _id: id }).populate("assignee");
        sendResponse(res, 200, true, task, null, "Get task successfully");
      } else {
        throw new AppError(400, "Invalid Id", "Get Task Error");
      }
    } else {
      throw new AppError(400, "Invalid Id", "Get Task Error");
    }
  } catch (error) {
    next(error);
  }
};

taskController.assignTask = async (req, res, next) => {
  const { idTask, idUser } = req.params;
  try {
    if (ObjectId.isValid(idTask) && ObjectId.isValid(idUser)) {
      if (
        String(new ObjectId(idTask)) === idTask &&
        String(new ObjectId(idUser)) === idUser
      ) {
        const taskUpdate = await Task.findOneAndUpdate(
          { _id: idTask },
          { $set: { assignee: idUser } },
          { new: true }
        );
        const userTasks = await User.findOneAndUpdate(
          { _id: idUser },
          { $addToSet: { task_id: idTask } },
          { new: true }
        );
        sendResponse(
          res,
          200,
          true,
          { taskUpdate, userTasks },
          null,
          "Assign Task Successfully"
        );
      } else {
        throw new AppError(400, "Invalid Id", "Assign Task Error");
      }
    } else {
      throw new AppError(400, "Invalid Id", "Assign Task Error");
    }
  } catch (error) {
    next(error);
  }
};

taskController.unassignTask = async (req, res, next) => {
  const { idTask, idUser } = req.params;
  try {
    if (ObjectId.isValid(idTask) && ObjectId.isValid(idUser)) {
      if (
        String(new ObjectId(idTask)) === idTask &&
        String(new ObjectId(idUser)) === idUser
      ) {
        const taskUpdate = await Task.findOneAndUpdate(
          { _id: idTask },
          { $set: { assignee: null } },
          { new: true }
        );
        const userTasks = await User.findOneAndUpdate(
          { _id: idUser },
          { $pull: { task_id: idTask } },
          { new: true }
        );
        sendResponse(
          res,
          200,
          true,
          { taskUpdate, userTasks },
          null,
          "Unassign Task Successfully"
        );
      } else {
        throw new AppError(400, "Invalid Id", "Unassign Task Error");
      }
    } else {
      throw new AppError(400, "Invalid Id", "Unassign Task Error");
    }
  } catch (error) {
    next(error);
  }
};

taskController.updateTask = async (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    let taskUpdate = null;
    const result = validationResult(req);
    if (result.isEmpty()) {
      const query = await Task.findOne({ _id: id });
      const taskStatus = query["status"];
      if (taskStatus === "done") {
        if (status === "archive") {
          taskUpdate = await Task.findOneAndUpdate(
            { _id: id },
            { status: status },
            { new: true }
          );
        } else {
          throw new AppError(
            400,
            "Can't update task status",
            "Update Task Error"
          );
        }
      } else {
        taskUpdate = await Task.findOneAndUpdate(
          { _id: id },
          { status: status },
          { new: true }
        );
      }
      sendResponse(
        res,
        200,
        true,
        taskUpdate,
        null,
        "Update Task Status Successfully"
      );
    } else {
      const errors = result.array();
      const errorsMsg = errors.map((item) => item.msg);
      const errorMsgText = errorsMsg.join(",");
      throw new AppError(400, `${errorMsgText}`, "Update Task Error");
    }
  } catch (error) {
    next(error);
  }
};

taskController.deleteTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (ObjectId.isValid(id)) {
      if (String(new ObjectId(id)) === id) {
        const taskDelete = await Task.findOneAndUpdate(
          { _id: id },
          { $set: { isDeleted: true } },
          { new: true }
        );
        sendResponse(
          res,
          200,
          true,
          taskDelete,
          null,
          "Delete Task Successfully"
        );
      } else {
        throw new AppError(400, "Invalid Id", "Delete Task Error");
      }
    } else {
      throw new AppError(400, "Invalid Id", "Delete Task Error");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = taskController;
