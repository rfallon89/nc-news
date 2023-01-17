const db = require("../../db/connection");
const { fetchTopics } = require("./app.topics.model");
exports.fetchArticles = ({ topic }, next) => {
  const queryValues = [];
  let sql = `SELECT articles.article_id, articles.author, articles.title,articles.topic, articles.created_at,articles.votes,articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
  FROM articles
  LEFT OUTER JOIN comments
  ON articles.article_id = comments.article_id`;

  if (topic) {
    queryValues.push(topic);
    sql += ` WHERE topic = $1`;
  }
  sql += ` GROUP BY articles.article_id
        ORDER BY articles.created_at DESC`;
  const sqlQuery = (queryValues) => {
    return db.query(sql, queryValues);
  };
  return Promise.all([sqlQuery(queryValues), fetchTopics(topic)])
    .then(([{ rows }]) => {
      return rows;
    })
    .catch(next);
};

exports.fetchArticle = ({ article_id }) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [+article_id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "Article ID does not exist",
        });
      }
      return article;
    });
};

exports.fetchArticleComments = (article_id) => {
  const sql = `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC`;
  return db.query(sql, [+article_id]).then(({ rows }) => {
    if (!rows[0]) {
      return Promise.reject({
        status: "404",
        msg: "No comments for this article ID",
      });
    }
    return rows;
  });
};
