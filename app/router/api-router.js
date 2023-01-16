const apiRouter = require("express").Router();
const { topicsRouter } = require("./index.routes");

apiRouter.use("/topics", topicsRouter);

module.exports = apiRouter;
