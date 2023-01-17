const {
  fetchArticles,
  fetchArticle,
  fetchArticleComments,
} = require("../models/app.articles.model");

exports.getArticles = (req, res, next) => {
  fetchArticles(req.query, next)
    .then((articles) => {
      if (articles) {
        res.status(200).send({ articles });
      }
    })
    .catch(next);
};

exports.getArticle = (req, res, next) => {
  fetchArticle(req.params)
    .then((article) => {
      res.status(200).send({ article: article });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleComments(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
