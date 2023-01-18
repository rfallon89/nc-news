const db = require("../../db/connection");

exports.fetchUsersByUsername = (username) => {
  const sql = `SELECT username FROM users WHERE username = $1`;
  return db.query(sql, [username]).then(({ rows: [user] }) => {
    if (!user) {
      return Promise.reject({
        status: 404,
        msg: "Username does not exist, create a user profile first",
      });
    }
    return user;
  });
};

exports.fetchUsers = () => {
  const sql = `SELECT * FROM users`;
  return db.query(sql).then(({ rows: users }) => users);
};
