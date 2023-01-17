const db = require("../../db/connection");

exports.fetchArticles = () => {
  const sql = `SELECT articles.article_id, articles.author, articles.title,articles.topic, articles.created_at,articles.votes,articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
  FROM articles
  LEFT OUTER JOIN comments
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC`;
  return db.query(sql).then((result) => result.rows);
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

exports.updateArticle = ({ article_id }, { inc_votes }) => {
  const sql = `UPDATE articles SET votes = votes+$2 WHERE article_id = $1 RETURNING *`;
  return db.query(sql, [article_id, inc_votes]).then(({ rows }) => {
    return rows[0];
  });
};
