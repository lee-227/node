function forEachObj(obj, cb) {
  Object.entries(obj).forEach(([key, value]) => {
    cb(key, value);
  });
}
exports.forEachObj = forEachObj;
