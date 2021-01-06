const { Router } = require("express");
const router = Router();

const userSessions = {};

router.post("/", (req, res) => {
  let { user, credential, additionalUserInfo } = req.body;
  if (!credential || !additionalUserInfo) {
    return res.status(400).end();
  }
  let uid = user.uid;
  if (credential.providerId === "facebook.com") {
    let id = additionalUserInfo.id;
    let scope = additionalUserInfo.granted_scopes;
    let token = credential.oauthAccessToken;
    let iss = Date.now();
    let exp = iss + 6000;
    userSessions[uid] = { id, scope, token, iss, exp };
  }
  res.status(201).end();
});

router.get("/:uid", (req, res) => {
  const { uid } = req.params;
  if (!uid) return res.status(400).end();
  const session = userSessions[uid];
  if (!session) return res.json({ status: "null" }).end();
  console.log(session);
  if (session.exp < Date.now()) {
    return res.json({ status: "expired" }).end();
  }
  return res.json({ status: "session", session }).end();
});

module.exports = router;
