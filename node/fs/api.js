const fs = require("fs");
const path = require("path");
// 1. readFile
// fs.readFile("README.md", "utf-8", (err, data) => {
//   console.log(err);
//   if (!null) {
//     console.log(data);
//   }
// });

// 2. writeFile
// fs.writeFile(
//   path.resolve(__dirname, "test.txt"),
//   "123111",
//   {
//     mode: 438, // 权限标识 全部权限
//     // flag: "r+", // r+ 覆盖原本内容不请空
//     flag: "w", // w w+ 清空内容 重新写入
//     encoding: "utf-8",
//   },
//   (err) => {
//     console.log(err);
//     if (!err) {
//       fs.readFile("data.txt", "utf-8", (err, data) => {
//         console.log(data);
//       });
//     }
//   },
// );

// 3. appendFile
// fs.appendFile(
//   path.resolve(__dirname, "test.txt"),
//   "hello node.js",
//   {},
//   (err) => {
//     console.log("写入成功");
//   },
// );

// 4. copyFile
// fs.copyFile(
//   path.resolve(__dirname, "test.txt"),
//   path.resolve(__dirname, "copy.txt"),
//   () => {
//     console.log("拷贝成功");
//   },
// );

// 5. watchFile
// fs.watchFile(
//   path.resolve(__dirname, "test.txt"),
//   { interval: 20 },
//   (curr, prev) => {
//     if (curr.mtime !== prev.mtime) {
//       console.log("文件被修改了");
//       fs.unwatchFile(path.resolve(__dirname, "test.txt"));
//     }
//   },
// );

// 6. open close
// fs.open(path.resolve(__dirname, "test.txt"), "r", (err, fd) => {
//   console.log(fd);
//   fs.close(fd, (err) => {
//     console.log("关闭成功");
//   });
// });

// 7. read ： 所谓的读操作就是将数据从磁盘文件中写入到 buffer 中
/**
 * fd 定位当前被打开的文件
 * buf 用于表示当前缓冲区
 * offset 表示当前从 buf 的哪个位置开始执行写入
 * length 表示当前次写入的长度
 * position 表示当前从文件的哪个位置开始读取
 */
// let buf = Buffer.alloc(10);
// fs.open(path.resolve(__dirname, "test.txt"), "r", (err, rfd) => {
//   console.log(err);
//   console.log(rfd);
//   fs.read(rfd, buf, 0, 4, 3, (err, readBytes, data) => {
//     console.log(readBytes);
//     console.log(data);
//     console.log(data.toString());
//   });
// });

// 8. write 将缓冲区里的内容写入到磁盘文件中
// let buf = Buffer.from("1234567890");
// fs.open(path.resolve(__dirname, "write.txt"), "w", (err, wfd) => {
//   fs.write(wfd, buf, 2, 4, 0, (err, written, buffer) => {
//     console.log(written, "----");
//     fs.close(wfd, () => {});
//   });
// });

// 9. access 文件是否存在
// fs.access(path.resolve(__dirname, "wriate.txt"), (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("有操作权限");
//   }
// });

// 10. stat 状态信息
// fs.stat(path.resolve(__dirname, "write.txt"), (err, statObj) => {
//   console.log(statObj);
//   console.log(statObj.size);
//   console.log(statObj.isFile());
//   console.log(statObj.isDirectory());
// });

// 11. mkdir { recursive: true }, 递归创建
// fs.mkdir(path.resolve(__dirname, "a/b/c"), { recursive: true }, (err) => {
//   if (!err) {
//     console.log("创建成功");
//   } else {
//     console.log(err);
//   }
// });

// 12. rmdir
// fs.rmdir(path.resolve(__dirname, "a"), { recursive: true }, (err) => {
//   if (!err) {
//     console.log("删除成功");
//   } else {
//     console.log(err);
//   }
// });

// 13. readdir
// fs.readdir(path.resolve(__dirname), (err, files) => {
//   console.log(files);
// });

// 14. unlink
// fs.unlink(path.resolve(__dirname, "copy.txt"), (err) => {
//   if (!err) {
//     console.log("删除成功");
//   }
// });
