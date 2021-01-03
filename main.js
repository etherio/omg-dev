const path = require("path");
const started = Date.now();
const maxAge = 30 * 60 * 1000;
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bootstrap = require("./src/bootstrap");

const tempDir = path.resolve("tmp");
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(tempDir));

app.use(require("./routes"));

bootstrap({ tempDir }).then(() => {
  app.listen(port, () =>
    console.log("Server is running on", `http://localhost:${port}`)
  );
});
