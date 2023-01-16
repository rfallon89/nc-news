const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticle,
} = require("../controllers/app.articles.controller");

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticle);

module.exports = articlesRouter;
