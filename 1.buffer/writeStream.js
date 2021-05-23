const EventEmitter = require("events");
const Queue = require("./Queue");
const fs = require("fs");
class WriteStream extends EventEmitter {
  constructor(path, options = {}) {
    super();
    this.path = path;
    this.flags = options.flags || "w";
    this.encoding = options.encoding || "utf8";
    this.autoClose = options.autoClose || true;
    this.highWaterMark = options.highWaterMark || 16 * 1024;
    this.open();
    this.len = 0;
    this.writing = false;
    this.needDrain = false;
    this.offset = 0;
    this.cache = new Queue();
  }
  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) return this.emit("error", err);
      this.fd = fd;
      this.emit("open", fd);
    });
  }
  write(chunk, encoding = this.encoding, cb = () => {}) {
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.len += chunk.length;
    let ret = this.len < this.highWaterMark;
    if (!ret) {
      this.needDrain = true;
    }
    if (this.writing) {
      this.cache.pop({
        chunk,
        encoding,
        cb,
      });
    } else {
      this.writing = true;
      this._write(chunk, encoding, () => {
        cb();
        this.clearBuffer();
      });
    }
    return ret;
  }
  _write(chunk, encoding, cb) {
    if (typeof this.fd !== "number") {
      return this.once("open", () => this._write(chunk, encoding, cb));
    }
    fs.write(this.fd, chunk, 0, chunk.length, this.offset, (err, written) => {
      this.len -= written;
      this.offset += written;
      cb();
    });
  }
  clearBuffer() {
    let data = this.cache.poll();
    if (data) {
      let { chunk, encoding, cb } = data;
      this._write(chunk, encoding, () => {
        cb();
        this.clearBuffer();
      });
    } else {
      this.writing = false;
      if (this.needDrain) {
        this.needDrain = false;
        this.emit("drain");
      }
    }
  }
}
module.exports = WriteStream;
