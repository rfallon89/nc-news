const db = require("../../db/connection");

exports.fetchTopics = () => {
  const sql = `SELECT * FROM topics`;
  return db.query(sql).then((result) => result.rows);
};
