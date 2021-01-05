const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bootstrap = require("./src/bootstrap");
const temp = path.resolve(process.cwd(), "dev");
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(temp));
app.use(require("./routes"));

bootstrap().then(() => {
  app.listen(port, () =>
    console.log("Server is running on", `http://localhost:${port}`)
  );
});
