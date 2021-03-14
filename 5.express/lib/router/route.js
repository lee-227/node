const methods = require("methods");
const Layer = require("./layer");
function Route() {
  this.stack = [];
  this.methods = {};
}
Route.prototype.match_method = function (method) {
  return this.methods[method.toLowerCase()];
};
methods.forEach((method) => {
  Route.prototype[method] = function (handlers) {
    if (!Array.isArray(handlers)) handlers = [handlers];
    handlers.forEach((handler) => {
      const layer = new Layer("", handler);
      layer.method = method;
      this.methods[method] = true;
      this.stack.push(layer);
    });
  };
});
Route.prototype.dispatch = function (req, res, out) {
  let idx = 0;
  let next = (err) => {
    if (err) return out(err);
    if (idx === this.stack.length) return out();
    let layer = this.stack[idx++];
    if (layer.method === req.method.toLowerCase()) {
      layer.handle_request(req, res, next);
    } else {
      next();
    }
  };
  next();
};
module.exports = Route;
