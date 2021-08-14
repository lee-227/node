const express = require("express");
const userCtrl = require("../controller/user");
const userValidator = require("../validator/user");
const auth = require("../middleware/auth");

const router = express.Router();

// 用户登录
router.post("/login", userValidator.login, userCtrl.login);

// 用户注册
router.post("/register", userValidator.register, userCtrl.register);

// 获取用户
router.get("/:username", userValidator.getUser, userCtrl.getUser);

// 获取当前登录用户
router.get("/user", auth, userCtrl.getCurrentUser);

// 更新当前登录用户
router.put("/user", auth, userCtrl.updateCurrentUser);

module.exports = router;
