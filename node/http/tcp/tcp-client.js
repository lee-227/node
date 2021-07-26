const net = require("net");
const Transform = require("./Transform");
const ts = new Transform();
const client = net.createConnection({
  port: 8888,
  host: "localhost",
});
let allBuf = null;
client.on("data", (chunk) => {
  let len = 0;
  allBuf = chunk;
  while ((len = ts.getLen(allBuf))) {
    const dataBuf = allBuf.slice(0, len);
    const otherBuf = allBuf.slice(len);
    const res = ts.decode(dataBuf);
    console.log(res);
    allBuf = otherBuf;
  }
});
client.write(ts.encode("你好你好！"));
client.write(ts.encode("你好你好！"));
client.write(ts.encode("你好你好！"));
client.write(ts.encode("你好你好！"));
client.write(ts.encode("你好你好！"));
