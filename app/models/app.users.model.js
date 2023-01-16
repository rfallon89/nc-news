const db = require("../../db/connection");

exports.fetchUsers = () => {
  const sql = `SELECT * FROM users`;
  return db.query(sql).then((result) => result.rows);
};
