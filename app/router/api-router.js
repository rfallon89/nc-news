const apiRouter = require("express").Router();
const { topicsRouter, commentsRouter } = require("./index.routes");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
