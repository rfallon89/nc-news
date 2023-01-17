const apiRouter = require("express").Router();
const {
  topicsRouter,
  commentsRouter,
  articlesRouter,
} = require("./index.routes");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
