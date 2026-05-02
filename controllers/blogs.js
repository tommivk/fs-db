const router = require("express").Router();
const { Blog } = require("../models");

router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.findAll();
    res.json(blogs);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.post("/", async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body });
    return res.json(blog);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blog.findByPk(id);
    if (!blog) {
      throw new Error(`Blog with id: ${id} not found`);
    }
    await blog.destroy();
    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { likes } = req.body;
    const blog = await Blog.findByPk(id);
    if (!blog) {
      throw new Error(`Blog with id: ${id} not found`);
    }
    await blog.update({ likes });
    return res.sendStatus(200);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

module.exports = router;
