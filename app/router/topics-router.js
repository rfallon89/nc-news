const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/app.topics.controller");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
