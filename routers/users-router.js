const { getAllUsers } = require("../controllers/endpoints.controller");

const usersRouter = require("express").Router();

usersRouter.route("/")
.get(getAllUsers)

module.exports = usersRouter