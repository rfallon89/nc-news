const { fetchTopics, addTopic } = require("../models/app.topics.model");

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.postTopic = (req, res, next) => {
  addTopic(req.body)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
