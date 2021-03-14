const methods = require("methods");
const Route = require("./route");
const Layer = require("./layer");
const url = require("url");
function Router() {
  let router = (req, res, next) => {
    router.handle(req, res, next);
  };
  router.stack = [];
  router.__proto__ = proto;
  return router;
}
let proto = {};
methods.forEach((method) => {
  proto[method] = function (path, handlers) {
    let route = this.route(path);
    route[method](handlers);
  };
});
proto.route = function (path) {
  let route = new Route();
  let layer = new Layer(path, route.dispatch.bind(route));
  layer.route = route;
  this.stack.push(layer);
  return route;
};
proto.handle = function (req, res, out) {
  let { pathname } = url.parse(req.url);
  let requestMethod = req.method.toLowerCase();
  let idx = 0;
  let remove = "";
  let next = (err) => {
    if (remove) {
      req.url = remove + pathname;
      remove = "";
    }
    if (idx === this.stack.length) return out();
    let layer = this.stack[idx++];
    if (err) {
      if (!layer.route) {
        layer.handle_error(err, req, res, next);
      } else {
        next(err);
      }
    } else {
      if (layer.match(pathname)) {
        req.params = layer.params;
        if (layer.route) {
          if (layer.route.match_method(requestMethod)) {
            layer.handle_request(req, res, next);
          } else {
            next();
          }
        } else {
          if (layer.handler.length != 4) {
            if (layer.path !== "/") {
              remove = layer.path;
              req.url = pathname.slice(remove.length);
            }
            layer.handle_request(req, res, next);
          } else {
            next();
          }
        }
      } else {
        next();
      }
    }
  };
  next();
};
proto.use = function (path, handler) {
  if (typeof path === "function") {
    handler = path;
    path = "/";
  }
  let layer = new Layer(path, handler);
  layer.route = undefined;
  this.stack.push(layer);
};
module.exports = Router;
