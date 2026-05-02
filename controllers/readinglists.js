const router = require("express").Router();
const { ReadingList, User, Blog } = require("../models");
const { sequelize } = require("../util/db");
const tokenExtractor = require("../middleware/tokenExtractor");

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
