/**
 * net 实现了底层的通信接口
 */
const net = require("net");
const Transform = require("./Transform");
const ts = new Transform();
const server = net.createServer();
server.listen(8888, "localhost");
server.on("listening", () => {
  console.log("您的服务已启动");
});
let allBuf;

// 不是每一次客户端的 write 都会触发一次data，
// 多次的write会在粘包之后只发送一次，之触发一次 data，此时在 data 中接收到的是粘包之后的总的数据
server.on("connection", (socket) => {
  socket.on("data", (chunk) => {
    let len = 0;
    allBuf = chunk;
    while ((len = ts.getLen(allBuf))) {
      const dataBuf = allBuf.slice(0, len);
      const otherBuf = allBuf.slice(len);
      const res = ts.decode(dataBuf);
      console.log(res);
      socket.write(ts.encode(res.body, res.no));
      allBuf = otherBuf;
    }
  });
});
server.on("error", (error) => {
  console.log(error);
});
