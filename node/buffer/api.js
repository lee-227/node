/**
 * Buffer 总结
 * 1. 无需引入的一个全局变量
 * 2. 实现了 Node 平台下的二进制数据操作
 * 3. 不占据 v8 堆内存大小的内存空间
 * 4. 内存的使用由 Node 控制，由 V8 的 GC 回收
 * 5. 一般配合 Stream 流使用，充当数据缓冲区
 */

// 1. 声明 buffer
// const b1 = Buffer.alloc(10); // 声明十个字节空间的 buffer
// const b2 = Buffer.allocUnsafe(10); // 声明十个字节空间的不干净的 buffer 可能会有残留数据
// const b3 = Buffer.from("中"); // 将传入的参数转换为 buffer
// const b4 = Buffer.from(["1", "2", "中"]); // 数组需要传入 buffer 数组
// console.log(b4);

// 2. fill 默认填充满整个空间
// let buf = Buffer.alloc(6);
// buf.fill("1", 1, 3); // 传入的数据会被转换成二进制进行操作
// console.log(buf);
// console.log(buf.toString());

// 3. write 只填充一遍
// let buf = Buffer.alloc(6);
// buf.write("1", 1, 3); // 传入的数据会被转换成二进制进行操作
// console.log(buf);
// console.log(buf.toString());

// 4. toString
// let buf = Buffer.from("xiao lee");
// console.log(buf);
// console.log(buf.toString("utf-8", 5, 7));

// 5. slice
// let buf = Buffer.from("xiao lee");
// let b1 = buf.slice(-3);
// console.log(b1);
// console.log(b1.toString());

// 6. indexOf
// let buf = Buffer.from("杜瑶智是小憨批，小猪猪，小傻瓜，小烦人精");
// console.log(buf);
// console.log(buf.indexOf("小", 13));

// 7. copy
// let b1 = Buffer.alloc(6);
// let b2 = Buffer.from("小李");

// b2.copy(b1, 0, 3, 6);
// console.log(b1.toString());
// console.log(b2.toString());

// 8. Buffer.concat
// let buf = Buffer.from("小李");
// let buf2 = Buffer.from("小杜");
// console.log(Buffer.concat([buf, buf2], 9).toString());

// 9. Buffer.isBuffer
// let buf = Buffer.from("buf");
// let noBuf = 123;
// console.log(Buffer.isBuffer(buf));
// console.log(Buffer.isBuffer(noBuf));
