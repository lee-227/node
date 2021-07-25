let fs = require("fs");
let path = require("path");
let ReadStream = require("./readStream");
// let rs = fs.createReadStream(path.resolve(__dirname, "./2.buffer.js"), {
let rs = new ReadStream(path.resolve(__dirname, "./2.buffer.js"), {
  flags: "r",
  encoding: null,
  autoClose: true,
  start: 0,
  end: 4,
  highWaterMark: 2,
});

rs.on("error", (err) => {
  console.log(err);
});
rs.on("open", (fd) => {
  console.log(fd);
});
let arr = [];
rs.on("data", (data) => {
  arr.push(data);
});
rs.on("end", () => {
  console.log(Buffer.concat(arr).toString());
});
rs.on("close", () => {
  console.log("close");
});
// rs.resume();
// rs.pause();
