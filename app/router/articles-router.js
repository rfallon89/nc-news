const articlesRouter = require("express").Router();
const { getArticles } = require("../controllers/app.articles.controller");

articlesRouter.get("/", getArticles);

module.exports = articlesRouter;
