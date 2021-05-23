module.exports = class UserController {
  async add(ctx, next) {
    ctx.body = "添加用户";
    await ctx.render("a.html", {
      name: "lee",
    });
  }
  async login(ctx, next) {
    ctx.body = ctx.request.body;
  }
};
