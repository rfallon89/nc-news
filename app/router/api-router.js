const apiRouter = require("express").Router();
const { topicsRouter, usersRouter } = require("./index.routes");

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
