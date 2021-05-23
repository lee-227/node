const Koa = require("koa");
const path = require("path");
const app = new Koa();
const bodyparser = require("./middlewares/bodyparser");
const static = require("./middlewares/static");
const views = require("koa-views");
const router = require("./routes");

app.use(bodyparser(path.resolve(__dirname, "upload")));

app.use(
  views(path.resolve(__dirname, "./views"), {
    map: {
      html: "ejs",
    },
  })
);

app.use(static("./views"));

app.use(router());

app.listen(3000);
