const {
  fetchArticles,
  fetchArticle,
  fetchArticleComments,
  updateArticle,
  addComment,
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

exports.patchArticle = (req, res, next) => {
  updateArticle(req.params, req.body)
    .then((update) => {
      res.status(200).send({ update });
    })
    .catch(next);
};

exports.postArticleComments = (req, res, next) => {
  const { username, body } = req.body;
  const { article_id } = req.params;
  addComment(username, body, article_id)
    .then((comment) => {
      res.status(201).send({ successful: comment });
    })
    .catch(next);
};
