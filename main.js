const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bootstrap = require("./src/bootstrap");
const xhub = require("express-x-hub");
const temp = path.resolve(process.cwd(), "dev");
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(xhub({ algorithm: "sha1", secret: process.env.APP_SECRET }));
app.use(require("./routes"));
app.use(express.static(temp));

bootstrap().then(() => {
  app.listen(port, () =>
    console.log("Server is running on", `http://localhost:${port}`)
  );
});
