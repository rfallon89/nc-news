const {
  fetchArticles,
  fetchArticle,
  addComment,
} = require("../models/app.articles.model");

exports.getArticles = (req, res, next) => {
  fetchArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getArticle = (req, res, next) => {
  fetchArticle(req.params)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.postArticleComments = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  addComment(username, body, article_id)
    .then((comment) => {
      res.status(200).send({ successful: comment });
    })
    .catch(next);
};
