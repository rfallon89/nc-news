const articlesRouter = require("express").Router();
const articles = require("../../db/data/test-data/articles");
const {
  getArticles,
  getArticle,
  getArticleComments,
  patchArticle,
  postArticleComments,
  postArticle,
  deleteArticle,
} = require("../controllers/app.articles.controller");

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticle);
articlesRouter.get("/:article_id/comments", getArticleComments);
articlesRouter.patch("/:article_id", patchArticle);
articlesRouter.post("/:article_id/comments", postArticleComments);
articlesRouter.post("/", postArticle);
articlesRouter.delete("/:article_id", deleteArticle);

module.exports = articlesRouter;
