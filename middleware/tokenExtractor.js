const jwt = require("jsonwebtoken");
const { SECRET } = require("../util/config");

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");

  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return res.status(401).json({ error: "token missing" });
  }

  try {
    const token = authorization.substring(7);

    req.token = token;
    req.decodedToken = jwt.verify(token, SECRET);

    next();
  } catch (err) {
    return res.status(401).json({ error: "token invalid" });
  }
};

module.exports = tokenExtractor;
