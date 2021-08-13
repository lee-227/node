const express = require("express");

const router = express.Router();

router.use(require("./user"));
// 文章相关路由
router.use("/articles", require("./article"));

module.exports = router;
