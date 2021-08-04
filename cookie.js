const crypto = require("crypto");
const http = require("http");
const querystring = require("querystring");
function sign(val) {
  return crypto
    .createHmac("sha256", "lee")
    .update(toString(val))
    .digest("base64")
    .replace(/\/|\=|\+/g, "");
}
const server = http.createServer((req, res) => {
  let cookies = [];
  res.setCookie = function (key, value, options = {}) {
    let opts = [];
    if (options.maxAge) {
      opts.push("max-age=" + options.maxAge);
    } else if (options.httpOnly) {
      opts.push("http-only=" + options.httpOnly);
    } else if (options.domain) {
      opts.push("domain" + options.domain);
    } else if (options.path) {
      opts.push("path" + options.path);
    }
    if (options.sign) {
      value = value + "." + sign(value);
    }
    cookies.push(`${key}=${value}; ${opts.join("; ")}`);
    res.setHeader("Set-Cookie", cookies);
  };
  req.getCookie = function (key, options = {}) {
    let result = querystring.parse(req.headers.cookie, "; ", "=");
    let [value, s] = (result[key] || "").split(".");
    if (options.sign) {
      if (s === sign(value)) {
        return value;
      } else {
        return undefined;
      }
    }
  };
  if (req.url === "/visit") {
    let visit = req.getCookie("visit", { sign: true });
    if (!visit) {
      visit = 1;
    } else {
      visit++;
    }
    res.setCookie("visit", visit, { sign: true, maxAge: 10 });
    res.setHeader("Content-Type", "text/html;charset=utf-8");
    res.end("您已经访问过" + visit + "次了");
  }
});
server.listen(8888);
