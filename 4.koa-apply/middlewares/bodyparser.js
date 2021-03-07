const quertstring = require("querystring");
const uuid = require("uuid");
const fs = require("fs");
const path = require("path");
module.exports = function bodyparser(uploadDir) {
  return async (ctx, next) => {
    ctx.request.body = await body(ctx, uploadDir);
    return next();
  };
};
function body(ctx, uploadDir) {
  return new Promise((resolve, reject) => {
    let arr = [];
    ctx.req.on("data", (chunk) => {
      arr.push(chunk);
    });
    ctx.req.on("end", () => {
      let type = ctx.headers["content-type"];
      let data = Buffer.concat(arr);
      if (!type || !data) {
        return resolve();
      }
      if (type === "application/x-www-form-urlencoded") {
        resolve(quertstring.parse(data.toString));
      } else if (type === "application/json") {
        resolve(JSON.parse(data.toString()));
      } else if (type === "text/plain") {
        resolve(data.toString());
      } else if (type.startsWith("multipart/form-data")) {
        let bondary = "--" + type.split("=")[1];
        let lines = data.split(bondary);
        lines = lines.slice(1, -1);
        let resultObj = {};
        lines.forEach((line) => {
          let [head, body] = line.split("\r\n\r\n");
          if (head) {
            let key = head.toString().match(/name="(.+?)"/)[1];
            if (!head.includes("filename")) {
              resultObj[key] = body.slice(0, -2).toString();
            } else {
              let originalName = head.toString().match(/filename="(.+?)"/)[1];
              let filename = uuid.v4();
              let content = line.slice(head.length + 4, -2);
              fs.writeFileSync(path.join(uploadDir, filename), content);
              resultObj[key] = resultObj[key] || [];
              resultObj[key].push({
                size: content.length,
                name: originalName,
                filename,
              });
            }
          }
        });
        resolve(resultObj);
      } else {
        resolve();
      }
    });
  });
}
Buffer.prototype.split = function (bondary) {
  let arr = [];
  let offset = 0;
  let currentPosition = 0;
  while (-1 !== (currentPosition = this.indexOf(bondary, offset))) {
    arr.push(this.slice(offset, currentPosition));
    offset = currentPosition + bondary.length;
  }
  arr.push(this.slice(offset));
  return arr;
};
