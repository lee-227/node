const express = require("express");
const { PORT } = require("./config");
const morgon = require("morgan");
const cors = require("cors");
const router = require("./router");
const errorHandler = require("./middleware/error-handler");
require("./model");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(morgon("dev"));
app.use(cors());

app.use("/api", router);

app.use(errorHandler());

app.listen(PORT, () => {
  console.log(process.env.NODE_ENV);
  console.log("http://localhost:" + PORT);
});
