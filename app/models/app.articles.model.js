const db = require("../../db/connection");
const { fetchUsersByUsername } = require("./app.users.model");
exports.fetchArticles = () => {
  const sql = `SELECT articles.article_id, articles.author, articles.title,articles.topic, articles.created_at,articles.votes,articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
  FROM articles
  LEFT OUTER JOIN comments
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC`;
  return db.query(sql).then((result) => result.rows);
};

exports.fetchArticle = ({ article_id }) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
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

exports.addComment = (username, body, article_id) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return Promise.all([
    exports.fetchArticle({ article_id }),
    fetchUsersByUsername(username),
  ]).then(() => {
    const sql = `INSERT INTO comments
    (author,body,article_id) VALUES ((SELECT username FROM users WHERE username = $1),$2,$3) RETURNING *`;
    return db.query(sql, [username, body, article_id]).then(({ rows }) => {
      return rows[0];
    });
  });
};
