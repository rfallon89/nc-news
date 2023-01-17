const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticle,
  getArticleComments,
} = require("../controllers/app.articles.controller");

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticle);
articlesRouter.get("/:article_id/comments", getArticleComments);

module.exports = articlesRouter;
