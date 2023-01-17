const db = require("../../db/connection");

exports.removeComment = ({ comment_id }) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      +comment_id,
    ])
    .then(({ rows }) => {
      const comment = rows[0];
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: "Comment ID does not exist",
        });
      }
      return comment;
    });
};