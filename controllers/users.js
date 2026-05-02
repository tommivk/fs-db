const router = require("express").Router();

const { User, Blog } = require("../models");

const userFinder = async (req, res, next) => {
  req.user = await User.findByPk(req.params.id);
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
