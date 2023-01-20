const db = require("../../db/connection");
const { fetchUsersByUsername } = require("./app.users.model");
const { fetchTopics } = require("./app.topics.model");

exports.fetchArticles = (
  { topic, sort_by = "created_at", order = "desc", limit = 10, p = 1 },
  next
) => {
  const queryValues = [];
  let sql = `SELECT articles.article_id, articles.author,articles.body, articles.title,articles.topic, articles.created_at,articles.votes,articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count, COUNT(*) OVER() ::INT AS total_count
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

  queryValues.push(+limit);
  sql += ` GROUP BY articles.article_id
          ORDER BY ${sort_by} ${order}
          LIMIT $${queryValues.length}`;

  queryValues.push((+p - 1) * limit);
  sql += ` OFFSET $${queryValues.length}`;

  const sqlQuery = (queryValues) => {
    return db.query(sql, queryValues);
  };
  return Promise.all([sqlQuery(queryValues), fetchTopics(topic)])
    .then(([{ rows: articles }]) => {
      if (!articles[0] & (p > 1)) {
        return Promise.reject({
          status: 404,
          msg: "Page Not Found",
        });
      }
      return articles;
    })
    .catch(next);
};

exports.fetchArticle = ({ article_id }) => {
  return db
    .query(
      `SELECT articles.article_id, articles.author, articles.title,articles.topic,articles.body, articles.created_at,articles.votes,articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT OUTER JOIN comments
    ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,
      [article_id]
    )
    .then(({ rows: [article] }) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "Article ID does not exist",
        });
      }
      return article;
    });
};

exports.fetchArticleComments = (
  { article_id },
  { limit = 10, p = 1, author }
) => {
  const queryValues = [+article_id, limit];
  let sql = `SELECT * FROM comments WHERE article_id = $1`;
  if (author) {
    queryValues.push(author);
    sql += ` AND author = $3`;
  }
  sql += ` ORDER BY created_at DESC LIMIT $2`;
  queryValues.push((+p - 1) * limit);
  sql += ` OFFSET $${queryValues.length}`;
  const query = (sql, queryValues) => {
    return db.query(sql, queryValues);
  };
  if (author) {
    let username = author;
    return fetchUsersByUsername({ username }).then(() => {
      return Promise.all([
        query(sql, queryValues),
        exports.fetchArticle({ article_id }),
      ]).then(([{ rows: comment }]) => {
        if (!comment[0] & (p > 1)) {
          return Promise.reject({
            status: 404,
            msg: "Page Not Found",
          });
        }
        return comment;
      });
    });
  } else {
    return Promise.all([
      query(sql, queryValues),
      exports.fetchArticle({ article_id }),
    ]).then(([{ rows: comment }]) => {
      if (!comment[0] & (p > 1)) {
        return Promise.reject({
          status: 404,
          msg: "Page Not Found",
        });
      }
      return comment;
    });
  }
};

exports.updateArticle = ({ article_id }, { inc_votes }) => {
  const sql = `UPDATE articles SET votes = votes+$2 WHERE article_id = $1 RETURNING *`;
  return db.query(sql, [article_id, inc_votes]).then(({ rows: [article] }) => {
    if (!article) {
      return Promise.reject({ status: 404, msg: "article id does not exist" });
    }
    return article;
  });
};

exports.addComment = (username, body, article_id) => {
  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  return Promise.all([
    exports.fetchArticle({ article_id }),
    fetchUsersByUsername({ username }),
  ]).then(() => {
    const sql = `INSERT INTO comments
    (author,body,article_id) VALUES ((SELECT username FROM users WHERE username = $1),$2,$3) RETURNING *`;
    return db
      .query(sql, [username, body, article_id])
      .then(({ rows: [comment] }) => {
        return comment;
      });
  });
};

exports.addArticle = ({ author, title, body, topic, article_img_url }) => {
  const values = [author, title, body, topic];
  let username = author;
  return values.includes(undefined)
    ? Promise.reject({ status: 400, msg: "Bad Request" })
    : fetchUsersByUsername({ username }).then(() => {
        let sql = "";
        if (!article_img_url) {
          sql = `INSERT INTO articles
      (author,title,body, topic) VALUES ((SELECT username FROM users WHERE username = $1),$2,$3,$4) RETURNING *`;
        } else {
          values.push(article_img_url);
          sql = `INSERT INTO articles
    (author,title,body, topic, article_img_url) VALUES ((SELECT username FROM users WHERE username = $1),$2,$3,$4,$5) RETURNING *`;
        }
        return db.query(sql, values).then(({ rows: [article] }) => {
          article.comment_count = 0;
          return article;
        });
      });
};

exports.removeArticle = ({ article_id }) => {
  return db
    .query(`DELETE FROM articles WHERE article_id = $1 RETURNING *`, [
      +article_id,
    ])
    .then(({ rows: [article] }) => {
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: "Article ID does not exist",
        });
      }
      return article;
    });
};
