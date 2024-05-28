const { sendResponse, AppError } = require("../helpers/utils");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const ObjectId = require("mongoose").Types.ObjectId;

const userController = {};

userController.createUser = async (req, res, next) => {
  const { name, role } = req.body;

  try {
    const result = validationResult(req);
    console.log(result);
    if (result.isEmpty()) {
      const userCreate = await User.create({
        name: name,
        role: role,
      });
      sendResponse(
        res,
        200,
        true,
        userCreate,
        null,
        "Create user successfully"
      );
    } else {
      const errors = result.array();
      const errorMsgs = errors.map((item) => item.msg);
      const errorMsgsText = errorMsgs.join(",");
      throw new AppError(400, `${errorMsgsText}`, "Create User Error");
    }
  } catch (error) {
    next(error);
  }
};

userController.getUsers = async (req, res, next) => {
  const { name } = req.query;
  const allowedQueries = "name";
  let users = [];
  try {
    const keys = Object.keys(req.query);
    if (keys.length !== 0) {
      keys.forEach((item) => {
        if (item !== allowedQueries) {
          throw new AppError(400, "Queries not allow");
        }
      });
      users = await User.find({ name: name });
    } else {
      users = await User.find();
    }
    sendResponse(res, 200, true, users, null, "Get users successfully");
  } catch (error) {
    next(error);
  }
};

userController.getUserByName = async (req, res, next) => {
  const { name } = req.params;
  try {
    const result = validationResult(req);
    console.log(result);
    if (result.isEmpty()) {
      const user = await User.findOne({ name: name });
      sendResponse(res, 200, true, user, null, "Get user successfully");
    } else {
      const errors = result.array();
      const errorMsgs = errors.map((item) => item.msg);
      const errorMsgsText = errorMsgs.join(",");
      throw new AppError(400, `${errorMsgsText}`, "Get User Error");
    }
  } catch (error) {
    next(error);
  }
};

userController.getTasks = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = validationResult(req);
    if (result.isEmpty()) {
      if (ObjectId.isValid(id)) {
        if (String(new ObjectId(id)) === id) {
          const user = await User.findOne({ _id: id }).populate({
            path: "task_id",
            match: {
              isDeleted: false,
            },
          });
          sendResponse(
            res,
            200,
            true,
            user,
            null,
            "Get user tasks successfully"
          );
        } else {
          throw new AppError(400, "Invalid Id", "Get Task Error");
        }
      } else {
        throw new AppError(400, "Invalid Id", "Get Task Error");
      }
    } else {
      const errors = result.array();
      const errorMsgs = errors.map((item) => item.msg);
      const errorMsgsText = errorMsgs.join(",");
      throw new AppError(400, `${errorMsgsText}`, "Get Task Error");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = userController;
