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
  const comment = Object.values(req.body);
  const { article_id } = req.params;
  comment.push(article_id);
  addComment(comment)
    .then((comment) => {
      res.status(200).send({ successful: comment });
    })
    .catch(next);
};
