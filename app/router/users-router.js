const usersRouter = require("express").Router();
const { getUsers } = require("../controllers/app.users.controllers");

usersRouter.get("/", getUsers);

module.exports = usersRouter;
