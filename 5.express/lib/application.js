const methods = require("methods");
const http = require("http");
const Router = require("./router");
function Application() {}
Application.prototype.lazy_router = function () {
  if (!this._router) {
    this._router = new Router();
  }
};
methods.forEach((method) => {
  Application.prototype[method] = function (path, ...handlers) {
    this.lazy_router();
    this._router[method](path, handlers);
  };
});
Application.prototype.use = function (path, hanlder) {
  this.lazy_router();
  this._router.use(path, hanlder);
};
Application.prototype.listen = function (...args) {
  const server = http.createServer((req, res) => {
    function done() {
      res.end(`Cannot ${req.method} ${req.url}`);
    }
    this.lazy_router();
    this._router.handle(req, res, done);
  });
  server.listen(...args);
};
module.exports = Application;
