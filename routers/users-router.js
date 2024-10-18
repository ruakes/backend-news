const { getAllUsers, getUsersByUsername } = require("../controllers/endpoints.controller");

const usersRouter = require("express").Router();

usersRouter.route("/")
.get(getAllUsers)

usersRouter.route("/:username")
.get(getUsersByUsername)

module.exports = usersRouter