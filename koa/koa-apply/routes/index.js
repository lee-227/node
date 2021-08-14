let userRouter = require("./userRouter");
let combinRouters = require("koa-combine-routers");

module.exports = combinRouters(userRouter);
