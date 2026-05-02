const router = require("express").Router();

const { User, Blog, ReadingList } = require("../models");

const userFinder = async (req, res, next) => {
  const { read } = req.query;
  const where = {};
  if (read) {
    where.read = read === "true";
  }

  req.user = await User.findByPk(req.params.id, {
    attributes: { exclude: [""] },
    include: [
      {
        model: Blog,
        as: "readings",
        attributes: ["id", "url", "title", "author", "likes", "year"],
        through: {
          attributes: ["read", "id"],
          as: "readinglists",
          where,
        },
      },
    ],
  });
  if (!req.user) {
    return res.status(404).end();
  }
  next();
};

router.get("/", async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ["userId"],
      },
    },
  });
  res.json(users);
});

router.post("/", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

router.put("/:username", async (req, res) => {
  const username = req.params.username;
  const { newUsername } = req.body;
  const user = await User.findOne({
    where: { username },
  });
  if (!user) {
    return res.sendStatus(404);
  }
  await user.update({ username: newUsername });
  return res.sendStatus(200);
});

router.get("/:id", userFinder, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
