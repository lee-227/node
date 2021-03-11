const express = require("./lib/express");
let app = express();
app.use(function (req, res, next) {
  console.log("中间件");
  next();
});
app.use("/user", function (req, res, next) {
  console.log("中间件2");
  next();
});
app.get(
  "/",
  (req, res, next) => {
    console.log(1);
    next("errrr");
  },
  (req, res, next) => {
    console.log(1);
    next();
  },
  (req, res, next) => {
    console.log(1);
    next();
  },
  (req, res, next) => {
    console.log(1);
    next();
  }
);
app.get(
  "/user/:id/:name",
  (req, res, next) => {
    console.log(2);
    res.end(JSON.stringify(req.params));
    // next();
  },
  (req, res, next) => {
    console.log(2);
    next();
  },
  (req, res, next) => {
    console.log(2);
    next();
  },
  (req, res, next) => {
    console.log(2);
    next();
  }
);
app.use((err, req, res, next) => {
  console.log(1);
  res.end(err);
});
app.listen(8888, () => {
  console.log(`Start server on port 8888`);
});
