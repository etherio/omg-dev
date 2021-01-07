const { Router } = require("express");
const router = Router();
const Guard = require("../src/guard");

const userSessions = {};

router.post("/", Guard.firebase("admin", "moderator"), (req, res) => {
  let { access_token, granted_scopes } = req.body;
  if (!access_token || !granted_scopes) {
    return res.status(400).end();
  }
  let uid = req.auth.uid;
  userSessions[uid] = { access_token, granted_scopes, issued: Date.now() };
  res.status(201).end();
});

router.get("/:uid", (req, res) => {
  const { uid } = req.params;
  const session = userSessions[uid];
  if (!session) return res.json({ access_token: null }).end();
  return res.json(session).end();
});

module.exports = router;
