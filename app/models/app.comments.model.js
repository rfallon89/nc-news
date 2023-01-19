const db = require("../../db/connection");

exports.removeComment = ({ comment_id }) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      +comment_id,
    ])
    .then(({ rows: [comment] }) => {
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: "Comment ID does not exist",
        });
      }
      return comment;
    });
};

exports.updateComment = ({ comment_id }, { inc_votes }) => {
  return db
    .query(
      `UPDATE comments SET votes = votes+$2 WHERE comment_id = $1 RETURNING *`,
      [+comment_id, +inc_votes]
    )
    .then(({ rows: [updated_comment] }) => {
      if (!updated_comment) {
        return Promise.reject({
          status: 404,
          msg: "Comment ID does not exist",
        });
      }
      return updated_comment;
    });
};
