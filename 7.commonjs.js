const path = require("path");
const fs = require("fs");
const vm = require("vm");
function myRequire(fileName) {
  fileName = Module._resolveFilename(fileName);
  if (Module._cache[fileName]) {
    return Module._cache[fileName].exports;
  }
  let module = new Module(fileName);
  Module._cache[fileName] = module;
  module.load();
  return module.exports;
}
function Module(fileName) {
  this.id = fileName;
  this.path = path.dirname(fileName);
  this.exports = {};
}
Module._extensions = {};
Module._extensions[".js"] = function (module) {
  let content = fs.readFileSync(module.id, "utf-8");
  let str = Module.wrapper(content);
  let fn = vm.runInThisContext(str);
  let exports = module.exports;
  fn.call(module.exports, exports, myRequire, module, module.id, module.path);
};
Module.wrapper = function (str) {
  return `(function(exports,require,module,__filename,__dirname){${str}})`;
};
Module._extensions[".json"] = function (module) {
  let content = fs.readFileSync(module.id, "utf-8");
  module.exports = JSON.parse(content);
};
Module._resolveFilename = function (fileName) {
  let filePath = path.resolve(__dirname, fileName);
  let isExists = fs.existsSync(filePath);
  if (isExists) return filePath;
  let keys = Reflect.ownKeys(Module._extensions);
  for (let i = 0; i < keys.length; i++) {
    let newFileName = filePath + keys[i];
    if (fs.existsSync(newFileName)) return newFileName;
  }
  throw new Error("module not found");
};
Module.prototype.load = function () {
  let extension = path.extname(this.id);
  Module._extensions[extension](this);
};
let val = myRequire("./a");
console.log(val);
