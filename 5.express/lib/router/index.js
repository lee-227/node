const methods = require("methods");
const Route = require("./route");
const Layer = require("./layer");
const url = require("url");
function Router() {
  this.stack = [];
}
methods.forEach((method) => {
  Router.prototype[method] = function (path, handlers) {
    let route = this.route(path);
    route[method](handlers);
  };
});
Router.prototype.route = function (path) {
  let route = new Route();
  let layer = new Layer(path, route.dispatch.bind(route));
  layer.route = route;
  this.stack.push(layer);
  return route;
};
Router.prototype.handle = function (req, res, out) {
  let { pathname } = url.parse(req.url);
  let requestMethod = req.method.toLowerCase();
  let idx = 0;
  let next = () => {
    if (idx === this.stack.length) return out();
    let layer = this.stack[idx++];
    if (layer.match(pathname)) {
      if (layer.route) {
        if (layer.route.match_method(requestMethod)) {
          layer.handle_request(req, res, next);
        } else {
          next();
        }
      } else {
        layer.handle_request(req, res, next);
      }
    } else {
      next();
    }
  };
  next();
};
Router.prototype.use = function (path, handler) {
  if (typeof path === "function") {
    handler = path;
    path = "/";
  }
  let layer = new Layer(path, handler);
  layer.route = undefined;
  this.stack.push(layer);
};
module.exports = Router;
