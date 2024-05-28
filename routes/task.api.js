const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createTask,
  getTask,
  getTaskById,
  assignTask,
  unassignTask,
  updateTask,
  deleteTask,
} = require("../controllers/task.controllers");

/**
 * @route GET api/task
 * @description Get list of tasks
 * @allowQueries: name, status
 */

router.get("/", getTask);

/**
 * @route POST api/task
 * @description Create task
 * @requiredBody: name, description
 */

const validateCreateTask = () => {
  return [
    body("name", "Task name cannot empty").notEmpty(),
    body("description", "Task description cannot empty").notEmpty(),
  ];
};

router.post("/", validateCreateTask(), createTask);

/**
 * @route GET api/task/:id
 * @description Get task by Id
 */

router.get("/:id", getTaskById);

/**
 * @route PUT api/task/assign/:id
 * @description Assign a task to a user
 */

router.put("/assign/:idUser/:idTask", assignTask);

/**
 * @route PUT api/task/unassign/:id
 * @description Unassign a task
 */

router.put("/unassign/:idUser/:idTask", unassignTask);

/**
 * @route PUT api/task/update/:id
 * @description Update task status by id
 * @requiredBody: status
 */

const validateStatus = () => {
  return body("status", "Status cannot be empty").notEmpty();
};

router.put("/update/:id", validateStatus(), updateTask);

/**
 * route PUT api/task/delete/:id
 * @description Delete task by id
 */

router.put("/delete/:id", deleteTask);

module.exports = router;
