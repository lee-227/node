const fs = require("fs");
const path = require("path");
function copy(sourcePath, targetPath, cb, config = {}) {
  let BUFFER_SIZE = config.size || 3;
  const buf = Buffer.alloc(BUFFER_SIZE);
  fs.open(sourcePath, "r", (err, rfd) => {
    fs.open(targetPath, "w", (err, wfd) => {
      let offset = 0;
      function next() {
        fs.read(rfd, buf, 0, BUFFER_SIZE, offset, (err, bytesRead) => {
          if (!bytesRead) {
            fs.close(rfd, () => {});
            fs.close(wfd, () => {});
            return cb && cb();
          }
          fs.write(wfd, buf, 0, bytesRead, (err, writen) => {
            offset += bytesRead;
            next();
          });
        });
      }
      next();
    });
  });
}
copy(
  path.resolve(__dirname, "test.txt"),
  path.resolve(__dirname, "copy.txt"),
  () => {
    console.log("over");
  },
);
