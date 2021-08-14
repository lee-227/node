const http = require("http");
const Stream = require("stream");
const context = require("./context");
const request = require("./request");
const response = require("./response");
const Event = require("event");
module.exports = class Application extends Event {
  constructor() {
    super();
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
    this.middlewares = [];
  }
  use(fn) {
    this.middlewares.push(fn);
  }
  createContext(req, res) {
    let ctx = Object.create(this.context);
    let request = Object.create(this.request);
    let response = Object.create(this.response);
    ctx.request = request;
    ctx.response = response;
    ctx.request.req = ctx.req = req;
    ctx.response.res = ctx.res = res;
    return ctx;
  }
  compose(ctx) {
    let index = -1;
    let dispatch = (i) => {
      if (index >= i) return Promise.reject("next() called multiples");
      if (i === this.middlewares.length) return Promise.resolve();
      index = i;
      let middleware = this.middlewares[i];
      try {
        return Promise.resolve(middleware(ctx, () => dispatch(i + 1)));
      } catch (error) {
        return Promise.reject(error);
      }
    };
    return dispatch(0);
  }
  handelRequest(req, res) {
    let ctx = this.createContext(req, res);
    res.statusCode = 404;
    this.compose(ctx)
      .then(() => {
        let body = ctx.body;
        if (typeof body === "string" || Buffer.isBuffer(body)) {
          res.end(body);
        } else if (body instanceof Stream) {
          body.pipe(res);
        } else if (typeof body === "object") {
          res.end(JSON.stringify(body));
        } else {
          res.end("Not Found");
        }
      })
      .catch((err) => {
        this.emit("error", err);
      });
    this.on("error", (err) => {
      res.statusCode = 500;
      res.end("Error:" + err);
    });
  }
  listen(...args) {
    const server = http.createServer(this.handelRequest.bind(this));
    server.listen(...args);
  }
};
