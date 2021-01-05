const { Router } = require("express");

const router = Router();
const token = process.env.APP_TOKEN || "secret-token";
const payloads = [];

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
    res.status(401);
    return;
  }
  let payload = { payload: req.body, timestamp: Date.now() };
  payloads.push(payload);
  res.status(200).end();
});

router.get("/payloads", (req, res) => {
  res.json({ data: payloads.reverse() }).end();
});

module.exports = router;
