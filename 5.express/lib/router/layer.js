const { pathToRegexp } = require("path-to-regexp");
function Layer(path, handler) {
  this.path = path;
  this.handler = handler;
  this.regExp = pathToRegexp(this.path, (this.keys = []), true);
}
Layer.prototype.match = function (path) {
  if (this.path === path) return true;
  if (this.keys.length > 0) {
    let matches = path.match(this.regExp);
    if (matches) {
      let values = matches.slice(1);
      this.params = {};
      this.keys.forEach((item, index) => {
        this.params[item.name] = values[index];
      });
      return true;
    }
  }
  if (!this.route) {
    if (this.path === "/") {
      return true;
    }
    return path.startsWith(this.path + "/");
  }
  return false;
};
Layer.prototype.handle_request = function (req, res, next) {
  this.handler(req, res, next);
};
Layer.prototype.handle_error = function (err, req, res, next) {
  if (this.handler.length === 4) {
    return this.handler(err, req, res, next);
  }
  next(err);
};
module.exports = Layer;
