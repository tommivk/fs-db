const Session = require("../models/session");

const sessionMiddleware = async (req, res, next) => {
  try {
    const session = await Session.findOne({
      where: { token: req.token },
    });

    if (!session) {
      return res.status(401).json({ error: "session not found" });
    }

    const MAX_SESSION_LENGTH = 1000 * 60 * 60 * 24;

    if (Date.now() - session.createdAt.getTime() > MAX_SESSION_LENGTH) {
      await session.destroy(); // optional cleanup
      return res.status(401).json({ error: "session expired" });
    }

    req.session = session;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = sessionMiddleware;
