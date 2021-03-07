let proxy = {};
module.exports = proxy;
function defineGetter(target, key) {
  proxy.__defineGetter__(key, function () {
    return this[target][key];
  });
}
function defineSetter(target, key) {
  proxy.__defineSetter__(key, function (val) {
    this[target][key] = val;
  });
}
defineGetter("request", "path");
defineGetter("request", "url");
defineGetter("response", "body");
defineSetter("response", "body");
