const { removeComment } = require("../models/app.comments.model");

exports.deleteComment = (req, res, next) => {
  removeComment(req.params)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
