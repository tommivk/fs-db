const router = require("express").Router();
const { ReadingList, User, Blog } = require("../models");
const { sequelize } = require("../util/db");
const { SECRET } = require("../util/config");
const jwt = require("jsonwebtoken");
const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET);
    } catch {
      return res.status(401).json({ error: "token invalid" });
    }
  } else {
    return res.status(401).json({ error: "token missing" });
  }
  next();
};

router.post("/", async (req, res) => {
  const { userId, blogId } = req.body;
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User does not exist");

  const blog = await Blog.findByPk(blogId);
  if (!blog) throw new Error("Blog does not exist");

  await ReadingList.create({ userId, blogId });
  res.sendStatus(200);
});

router.put("/:id", tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);

  const readinglist = await ReadingList.findByPk(req.params.id);
  if (!readinglist) {
    return res.sendStatus(404);
  }
  console.log("?????????", { readinglist, user });
  if (readinglist.userId !== user.id) {
    return res.sendStatus(401);
  }

  await readinglist.update({ read: req.body.read });
  res.sendStatus(200);
});

module.exports = router;
