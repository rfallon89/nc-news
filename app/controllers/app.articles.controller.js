const { fetchArticles, fetchArticle } = require("../models/app.articles.model");

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
