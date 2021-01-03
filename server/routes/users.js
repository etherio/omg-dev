const { Router } = require("express");
const Guard = require("../src/guard");
const User = require("../src/User");
const admin = require("firebase-admin");

const router = Router();

router.get("/", Guard.allows("admin", "moderator"), async (req, res) => {
  try {
    let { users } = await admin.auth().listUsers();
    users = users
      .filter((user) => user.uid !== req.auth.uid)
      .map((user) => new User(user));
    res.json(users).end();
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ code: "server/internal-error", message: e.message })
      .end();
  }
});

router.get("/:uid", Guard.allows("admin", "moderator"), async (req, res) => {
  try {
    let { uid } = req.params;
    let user = await admin.auth().getUser(uid);
    res.json(user);
  } catch (e) {
    switch (e.code) {
      case "auth/user-not-found":
        break;
      default:
        console.error(e);
        e.code = e.code || "server/internal-error";
    }
    res
      .status(500)
      .json(e)
      .end();
  }
});

router.post("/:uid", Guard.allows("admin"), async (req, res) => {
  try {
    let { uid } = req.params;
    let { role } = req.body;
    await admin.auth().setCustomUserClaims(uid, { role });
    res.json({ uid, role }).end();
  } catch (e) {
    switch (e.code) {
      case "auth/user-not-found":
        break;
      default:
        console.error(e);
        e.code = e.code || "server/internal-error";
    }
    res
      .status(500)
      .json(e)
      .end();
  }
});

module.exports = router;
