const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const {
  createUser,
  getUsers,
  getUserByName,
  getTasks,
} = require("../controllers/user.controllers");

/**
 * @route GET api/users
 * @description Get a list of users
 * @allowedQueries: name
 */

router.get("/", getUsers);

/**
 * @route GET api/users/getUser/:name
 * @description Get user by name
 */

const validateUserName = () => {
  return [
    param("name", "Username cannot empty").notEmpty(),
    param("name", "Username must be Alphabet").matches(/^[A-Za-z\s]+$/),
  ];
};

router.get("/getUser/:name", validateUserName(), getUserByName);

/**
 * @route POST api/users
 * @description Create user
 * @requiredBody: name, role
 */

const validateUser = () => {
  return [
    body("name", "Username cannot empty").notEmpty(),
    body("name", "Username must be Alphabet").matches(/^[A-Za-z\s]+$/),
  ];
};

router.post("/", validateUser(), createUser);

/**
 * @route GET api/users/getTask/:id
 * @description Get tasks by user id
 */

const validateUserId = () => {
  return param("id", "Id cannot empty").notEmpty();
};

router.get("/getTask/:id", validateUserId(), getTasks);

module.exports = router;
