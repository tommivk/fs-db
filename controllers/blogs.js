const router = require("express").Router();
const { Blog } = require("../models");

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id);
  if (!req.blog) {
    return res.status(404).end();
  }
  next();
};

router.get("/", async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post("/", async (req, res) => {
  const blog = await Blog.create({ ...req.body });
  return res.json(blog);
});

router.delete("/:id", blogFinder, async (req, res) => {
  await req.blog.destroy();
  return res.sendStatus(200);
});

router.put("/:id", blogFinder, async (req, res) => {
  const { likes } = req.body;
  await req.blog.update({ likes });
  return res.sendStatus(200);
});

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = router;
