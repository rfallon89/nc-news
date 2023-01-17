const express = require("express");
const app = express();
const apiRouter = require("./router/api-router");

app.use(express.json());
app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ message: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "08P01" || err.code === "23502") {
    res.status(400).send({ message: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err, ">>>>>>");
  res.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
