const UserController = require("../controller/UserController");
let Router = require("koa-router");

let userCon = new UserController();
const router = new Router({ prefix: "/user" });

router.get("/add", userCon.add);
router.post("/login", userCon.login);
module.exports = router;
