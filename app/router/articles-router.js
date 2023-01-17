const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticle,
  getArticleComments,
  patchArticle,
  postArticleComments,
} = require("../controllers/app.articles.controller");

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticle);
articlesRouter.get("/:article_id/comments", getArticleComments);
articlesRouter.patch("/:article_id", patchArticle);
articlesRouter.post("/:article_id/comments", postArticleComments);

module.exports = articlesRouter;
