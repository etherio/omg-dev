const express = require("express");
const router = express.Router();
const serverStarted = Date.now();
const maxAge = 30 * 60 * 1000;

const serverInfo = {
  requested: 0,
};

router.use((req, res, next) => {
  serverInfo.requested++;
  req.accessToken = req.headers["x-access-token"] || null;
  res.setHeader("Cache-Control", "private;max-age=60");
  next();
});

router.use("/products", require("./products"));
router.use("/users", require("./users"));
router.use("/metadata", require("./metadata"));

router.all("/status", (req, res) => {
  const status = {
    started: serverStarted,
    expired: serverStarted + maxAge,
    requested: serverInfo.requested,
    timestamp: Date.now(),
  };
  if ("utc" in req.query) {
    status.started = new Date(status.started).toUTCString();
    status.expired = new Date(status.expired).toUTCString();
    status.timestamp = new Date(status.timestamp).toUTCString();
  }
  res.json(status);
});

router.use((req, res) => {
  res.status(404).json({ error: "request not found" }).end();
  console.log("[404]", req.path);
});

module.exports = router;
