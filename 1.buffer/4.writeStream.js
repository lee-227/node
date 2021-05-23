const fs = require("fs");
const path = require("path");
const WriteStream = require("./writeStream");
// const ws = fs.createWriteStream(path.resolve(__dirname, "./write-test.js"), {
const ws = new WriteStream(path.resolve(__dirname, "./write-test.js"), {
  flags: "w",
  encoding: "utf8",
  autoClose: true,
  highWaterMark: 2,
});
ws.on("open", (fd) => {
  console.log(fd);
});
let flag = ws.write("l");
console.log(flag);
flag = ws.write("e");
console.log(flag);
flag = ws.write("e");
console.log(flag);
ws.on("drain", () => {
  console.log("drain");
});
