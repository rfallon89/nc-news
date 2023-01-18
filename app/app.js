const express = require("express");
const app = express();
const apiRouter = require("./router/api-router");
const {
  customError,
  sqlError,
  serverError,
  pathError,
} = require("./error-handling");

app.use(express.json());
app.use("/api", apiRouter);

app.use(customError);
app.use(sqlError);
app.use(pathError);
app.use(serverError);

module.exports = app;
