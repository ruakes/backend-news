const { getAllTopics } = require("../controllers/endpoints.controller");

const topicsRouter = require("express").Router();

topicsRouter.route("/")
.get(getAllTopics)

module.exports = topicsRouter;