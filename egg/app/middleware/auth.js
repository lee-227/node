module.exports = (options = { required: true }) => {
  return async function auth(ctx, next) {
    let token = ctx.headers.authorization
    token = token ? token.split('Bearer ')[1] : null
    try {
      if (token) {
        const data = ctx.service.user.verifyToken(token)
        ctx.user = await ctx.service.user.findById(data.userId)
      } else if (options.required) {
        ctx.throw(401)
      }
    } catch (error) {
      ctx.throw(401)
    }
    await next()
  };
};
