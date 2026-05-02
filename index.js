require("dotenv").config();
const { Sequelize, Model, DataTypes } = require("sequelize");
const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");
const { Blog, User } = require("./models");
const express = require("express");
const app = express();

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const authorsRouter = require("./controllers/authors");

app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/authors", authorsRouter);

app.get("/", async (req, res) => {
  return res.sendStatus(200);
});

app.post("/api/reset", async (req, res) => {
  await Blog.destroy({ where: {}, truncate: true, cascade: true });
  await User.destroy({ where: {}, truncate: true, cascade: true });
  return res.sendStatus(200);
});

app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      error: err.errors.map((e) => e.message),
    });
  }

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
