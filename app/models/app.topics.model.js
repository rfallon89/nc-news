const db = require("../../db/connection");

exports.fetchTopics = (topic) => {
  let sql = `SELECT * FROM topics`;
  const queryArr = [];
  if (topic) {
    sql += ` WHERE slug= $1`;
    queryArr.push(topic);
  }
  return db.query(sql, queryArr).then(({ rows }) => {
    if (!rows[0]) {
      return Promise.reject({ status: 404, msg: "topic does not exist" });
    }
    return rows;
  });
};
