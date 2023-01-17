const db = require("../../db/connection");
const { fetchTopics } = require("./app.topics.model");
exports.fetchArticles = (
  { topic, sort_by = "created_at", order = "desc" },
  next
) => {
  const queryValues = [];
  let sql = `SELECT articles.article_id, articles.author, articles.title,articles.topic, articles.created_at,articles.votes,articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
  FROM articles
  LEFT OUTER JOIN comments
  ON articles.article_id = comments.article_id`;

  const sort_byCriteria = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
  ];
  if (!sort_byCriteria.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid Query" });
  }
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Query" });
  }

  if (topic) {
    queryValues.push(topic);
    sql += ` WHERE topic = $1`;
  }
  sql += ` GROUP BY articles.article_id
          ORDER BY ${sort_by} ${order}`;
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
