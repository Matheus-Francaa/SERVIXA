const { fromNodeHeaders } = require("better-auth/node");

function requireAuth(auth) {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      if (!session || !session.user) {
        return res.status(401).json({ error: "Não autorizado" });
      }
      req.user = session.user;
      req.session = session.session;
      next();
    } catch (err) {
      return res.status(401).json({ error: "Não autorizado" });
    }
  };
}

function optionalAuth(auth) {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      if (session && session.user) {
        req.user = session.user;
        req.session = session.session;
      }
    } catch (_) {}
    next();
  };
}

module.exports = { requireAuth, optionalAuth };
