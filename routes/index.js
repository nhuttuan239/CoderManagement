var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("Welcome to CoderManagement - by Tuan");
});

const userRouter = require("./user.api");
const taskRouter = require("./task.api");

router.use("/users", userRouter);
router.use("/task", taskRouter);

module.exports = router;
