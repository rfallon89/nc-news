exports.customError = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ message: err.msg });
  } else {
    next(err);
  }
};

exports.sqlError = (err, req, res, next) => {
  if (err.code === "22P02" || err.code === "08P01" || err.code === "23502") {
    res.status(400).send({ message: "Bad Request" });
  } else {
    next(err);
  }
};

exports.pathError = (req, res, next) => {
  res.status(404).send({ message: "Path Not Found" });
};

exports.serverError = (err, req, res, next) => {
  res.status(500).send({ message: "Internal Server Error" });
};
