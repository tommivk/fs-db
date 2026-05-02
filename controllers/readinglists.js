const router = require("express").Router();
const { ReadingList, User, Blog } = require("../models");
const { sequelize } = require("../util/db");
const tokenExtractor = require("../middleware/tokenExtractor");
const sessionCheck = require("../middleware/sessionCheck");

router.post("/", async (req, res) => {
  const { userId, blogId } = req.body;
  if (!userId || !blogId) {
    return res.status(400).json({});
  }
  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(404).json({
      error: "User does not exist",
    });
  }

  const blog = await Blog.findByPk(blogId);
  if (!blog) {
    return res.status(404).json({
      error: "Blog does not exist",
    });
  }

  const exists = await ReadingList.findOne({
    where: {
      userId,
      blogId,
    },
  });

  if (exists) {
    return res.status(400).json({
      error: "Blog is already added to reading list",
    });
  }

  const readinglist = await ReadingList.create({
    user_id: userId,
    blog_id: blogId,
  });
  res.json(readinglist);
});

router.put("/:id", tokenExtractor, sessionCheck, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);

  const readinglist = await ReadingList.findByPk(req.params.id);
  if (!readinglist) {
    return res.sendStatus(404);
  }

  if (readinglist.userId !== user.id) {
    return res.sendStatus(401);
  }

  const updatedList = await readinglist.update({ read: req.body.read });
  res.json(updatedList);
});

module.exports = router;
