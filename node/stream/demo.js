const { Readable } = require("stream");

// 模拟底层数据
let source = ["lg", "zce", "syy"];

// 自定义类继承 Readable
class MyReadable extends Readable {
  constructor(source) {
    super();
    this.source = source;
  }
  _read() {
    let data = this.source.shift() || null;
    this.push(data);
  }
}

// 实例化
let myReadable = new MyReadable(source);

/* myReadable.on('readable', () => {
  let data = null 
  while((data = myReadable.read(2)) != null) {
    console.log(data.toString())
  }
}) */

myReadable.on("data", (chunk) => {
  console.log(chunk.toString());
});

// 字定义类继承可写流
const { Writable } = require("stream");

class MyWriteable extends Writable {
  constructor() {
    super();
  }
  _write(chunk, en, done) {
    process.stdout.write(chunk.toString() + "<----");
    process.nextTick(done);
  }
}

let myWriteable = new MyWriteable();

myWriteable.write("拉勾教育", "utf-8", () => {
  console.log("end");
});

// 自定义类继承双工流
let { Duplex } = require("stream");

class MyDuplex extends Duplex {
  constructor(source) {
    super();
    this.source = source;
  }
  _read() {
    let data = this.source.shift() || null;
    this.push(data);
  }
  _write(chunk, en, next) {
    process.stdout.write(chunk);
    process.nextTick(next);
  }
}

let source = ["a", "b", "c"];
let myDuplex = new MyDuplex(source);

/* myDuplex.on('data', (chunk) => {
  console.log(chunk.toString())
}) */
myDuplex.write("拉勾教育", () => {
  console.log(1111);
});

// 字定义类继承转换流
let { Transform } = require("stream");

class MyTransform extends Transform {
  constructor() {
    super();
  }
  _transform(chunk, en, cb) {
    this.push(chunk.toString().toUpperCase());
    cb(null);
  }
}

let t = new MyTransform();

t.write("a");

t.on("data", (chunk) => {
  console.log(chunk.toString());
});
