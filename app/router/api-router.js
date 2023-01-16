const apiRouter = require("express").Router();
const { topicsRouter, articlesRouter } = require("./index.routes");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
