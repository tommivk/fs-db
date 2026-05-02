const router = require("express").Router();
const { Blog, User, Session } = require("../models");
const { Op } = require("sequelize");
const tokenExtractor = require("../middleware/tokenExtractor");
const sessionCheck = require("../middleware/sessionCheck");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    return res.status(404).end();
  }
  next();
};

router.get("/", async (req, res) => {
  const where = req.query.search
    ? {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${req.query.search}%`,
            },
          },
          {
            author: {
              [Op.iLike]: `%${req.query.search}%`,
            },
          },
        ],
      }
    : {};
  const blogs = await Blog.findAll({
    attributes: { exclude: ["userId"] },
    include: {
      model: User,
      attributes: ["name"],
    },
    where,
    order: [["likes", "DESC"]],
  });
  res.json(blogs);
});

router.post("/", tokenExtractor, sessionCheck, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id);
  const blog = await Blog.create({ ...req.body, userId: user.id });
  return res.json(blog);
});

router.delete(
  "/:id",
  blogFinder,
  tokenExtractor,
  sessionCheck,
  async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id);
    if (req.blog.userId !== user.id) {
      return res.sendStatus(401);
    }
    await req.blog.destroy();
    return res.sendStatus(200);
  },
);

router.put("/:id", blogFinder, async (req, res) => {
  const { likes } = req.body;
  const blog = await req.blog.update({ likes });
  return res.json(blog);
});

module.exports = router;
