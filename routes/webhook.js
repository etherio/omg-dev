const { Router } = require("express");

const router = Router();
const token = process.env.APP_TOKEN || "secret-token";

router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const verfy_token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && verfy_token === token) {
    res.send(challenge).end();
  } else {
    res.status(400).end();
  }
});

router.post("/", (req, res) => {
  if (!req.isXHubValid()) {
    res.sendStatus(401);
    return;
  }
  console.log("Facebook request body:", req.body);
});

module.exports = router;
