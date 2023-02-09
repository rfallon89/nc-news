const db = require("../../db/connection");

exports.fetchUsersByUsername = ({ username }) => {
  const sql = `SELECT * FROM users WHERE username = $1`;
  return db.query(sql, [username]).then(({ rows: [user] }) => {
    if (!user) {
      return Promise.reject({
        status: 404,
        msg: "Username does not exist",
      });
    }
    return user;
  });
};

exports.fetchUsers = ({ limit = 10, p = 1, order = "asc" }) => {
  const queryValues = [limit];
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid Query" });
  }
  let sql = `SELECT * FROM users ORDER BY username ${order} LIMIT $1 `;
  queryValues.push((+p - 1) * limit);
  sql += ` OFFSET $2`;
  return db.query(sql, queryValues).then(({ rows: users }) => {
    if (!users[0] & (p > 1)) {
      return Promise.reject({
        status: 404,
        msg: "Page Not Found",
      });
    }
    return users;
  });
};

exports.addUser = ({ username, name, avatar_url }) => {
  let sql = `INSERT INTO users
  (username,name,avatar_url) VALUES ($1,$2,$3) RETURNING *`;
  return db
    .query(sql, [username, name, avatar_url])
    .then(({ rows: [user] }) => user);
};
