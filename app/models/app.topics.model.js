const db = require("../../db/connection");

exports.fetchTopics = (topic) => {
  let sql = `SELECT * FROM topics`;
  const queryArr = [];
  if (topic) {
    sql += ` WHERE slug= $1`;
    queryArr.push(topic);
  }
  return db.query(sql, queryArr).then(({ rows: topics }) => {
    if (!topics[0]) {
      return Promise.reject({ status: 404, msg: "topic does not exist" });
    }
    return topics;
  });
};

exports.addTopic = ({ slug, description }) => {
  return db
    .query(
      `INSERT INTO topics (slug, description) VALUES ($1,$2) RETURNING *`,
      [slug, description]
    )
    .then(({ rows: [topic] }) => {
      return topic;
    });
};
