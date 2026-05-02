const jwt = require("jsonwebtoken");
const router = require("express").Router();
const tokenExtractor = require("../middleware/tokenExtractor");
const User = require("../models/user");
const Session = require("../models/session");

router.delete("/", tokenExtractor, async (req, res) => {
  await Session.destroy({ where: { token: req.token } });
  return res.sendStatus(200);
});

module.exports = router;
