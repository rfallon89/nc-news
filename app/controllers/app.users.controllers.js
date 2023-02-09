const {
  fetchUsers,
  fetchUsersByUsername,
  addUser,
} = require("../models/app.users.model");

exports.getUsers = (req, res, next) => {
  fetchUsers(req.query)
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  fetchUsersByUsername(req.params)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  addUser(req.body)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch(next);
};
