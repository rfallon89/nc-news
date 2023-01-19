const {
  removeComment,
  updateComment,
} = require("../models/app.comments.model");

exports.deleteComment = (req, res, next) => {
  removeComment(req.params)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  updateComment(req.params, req.body)
    .then((updated_comment) => {
      res.status(200).send({ updated_comment });
    })
    .catch(next);
};
