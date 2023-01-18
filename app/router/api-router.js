const apiRouter = require("express").Router();
const {
  topicsRouter,
  commentsRouter,
  usersRouter,
  articlesRouter,
} = require("./index.routes");
const { getEndpoints } = require("../controllers/app.api.controller");

apiRouter.get("/", getEndpoints);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/comments", commentsRouter);
apiRouter.use("/articles", articlesRouter);

apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
