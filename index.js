require("dotenv").config();
const { Sequelize, Model, DataTypes } = require("sequelize");
const { PORT } = require("./util/config");
const { connectToDatabase } = require("./util/db");
const express = require("express");
const app = express();

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const logoutRouter = require("./controllers/logout");
const authorsRouter = require("./controllers/authors");
const resetRouter = require("./controllers/reset");
const readinglistsRouter = require("./controllers/readinglists");

app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/logout", logoutRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/reset", resetRouter);
app.use("/api/readinglists", readinglistsRouter);

app.get("/", async (req, res) => {
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
