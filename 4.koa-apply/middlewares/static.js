const path = require("path");
const fs = require("fs").promises;
const mime = require("mime");
const { createReadStream } = require("fs");
module.exports = function koaStatic(dirname) {
  return async (ctx, next) => {
    let filePath = path.join(dirname, ctx.path);
    try {
      let statObj = await fs.stat(filePath);
      if (statObj.isFile()) {
        ctx.set("Content-Type", mime.getType(filePath) + ";charset=utf-8");
        ctx.body = createReadStream(filePath);
      } else {
        // 理论上找index.html...
        await next();
      }
    } catch (e) {
      await next();
    }
  };
};
