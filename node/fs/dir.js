const fs = require("fs");
let path = require("path");
function rmdir(parentPath, cb) {
  fs.stat(parentPath, (err, stat) => {
    if (err) return cb(err);
    if (stat.isDirectory()) {
      fs.readdir(parentPath, (err, dirs) => {
        let index = 0;
        if (dirs.length === 0) {
          fs.rmdir(parentPath, cb);
        }
        dirs.forEach((childrenPath) => {
          let p = path.join(parentPath, childrenPath);
          rmdir(p, () => {
            if (++index === dirs.length) {
              fs.rmdir(parentPath, cb);
            }
          });
        });
      });
    } else {
      fs.unlink(parentPath, cb);
    }
  });
}
function rmdir(parentPath, cb) {
  fs.stat(parentPath, (err, stat) => {
    if (err) return cb(err);
    if (stat.isDirectory()) {
      fs.readdir(parentPath, (err, dirs) => {
        let index = 0;
        function next() {
          if (index === dirs.length) return fs.rmdir(parentPath, cb);
          rmdir(path.join(parentPath, dirs[index++]), next);
        }
        next();
      });
    } else {
      fs.unlink(parentPath, cb);
    }
  });
}
rmdir(path.resolve(__dirname, "a"), () => {
  console.log("完成");
});
function mkdir(totalPath, cb) {
  let paths = totalPath.split(path.sep);
  let index = 0;
  function next() {
    if (index === paths.length) return cb && cb();
    let p = paths.slice(0, ++index).join("/");
    fs.access(p, (err) => {
      if (err) {
        fs.mkdir(p, next);
      } else {
        next();
      }
    });
  }
  next();
}
mkdir(path.resolve(__dirname, "a/b/c"), () => {
  console.log("创建成功");
});
