const express = require("./lib/express");
let app = express();
let router = express.Router();
router.get("/add", (req, res, next) => {
  res.end("user add");
});
app.use("/user", router);
app.listen(8888, () => {
  console.log(`Start server on port 8888`);
});
