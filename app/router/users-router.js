const usersRouter = require("express").Router();
const {
  getUsers,
  getUser,
  postUser,
} = require("../controllers/app.users.controllers");

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUser);
usersRouter.post("/", postUser);

module.exports = usersRouter;
