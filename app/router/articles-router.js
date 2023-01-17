const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticle,
  getArticleComments,
  patchArticle,
} = require("../controllers/app.articles.controller");

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticle);
articlesRouter.get("/:article_id/comments", getArticleComments);
articlesRouter.patch("/:article_id", patchArticle);

module.exports = articlesRouter;
