const db = require("../../db/connection");

exports.fetchArticles = () => {
  const sql = `SELECT articles.article_id, articles.author, articles.title,articles.topic, articles.created_at,articles.votes,articles.article_img_url, COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT OUTER JOIN comments
  ON articles.article_id = comments.article_id
  GROUP BY articles.article_id`;
  return db.query(sql).then((result) => result.rows);
};
