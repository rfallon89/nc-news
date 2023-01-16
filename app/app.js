const express = require("express");
const app = express();
const apiRouter = require("./router/api-router");

app.use(express.json());
app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
