exports.getEndpoints = (req, res, next) => {
  res.status(200).send({
    endpoints: {
      "get(/articles)": ["/:article_id", "/:article_id/comments"],
      "patch(/articles)": ["/:article_id"],
      "post(/articles)": ["/:article_id/comments"],
      "delete(/comments)": ["/:comment_id"],
      "get(/topics)": [],
      "get)/users)": [],
    },
  });
};
