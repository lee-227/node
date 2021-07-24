// 1. 资源 cpu 内存
// console.log(process.memoryUsage());
//   {
//     rss: 19079168, 常驻内存，本机内存的一部分
//     heapTotal: 4468736, 脚本运行时申请的内存大小
//     heapUsed: 2609656, 脚本已使用内存
//     external: 855863, 底层 c、c++ 核心模块占据的内存大小
//     arrayBuffers: 9898 buffer缓冲区 独立占用的内存，不占据 v8 使用的内存
//   }

// console.log(process.cpuUsage());
// { user: 78000, system: 15000 } user：用户占据的cpu片段 system：系统占据

// 2. 运行环境：运行目录、node环境、cpu架构(x64)、用户环境、系统平台
// console.log(process.cwd());
// console.log(process.version);
// console.log(process.versions);
// console.log(process.arch);
// console.log(process.env.NODE_ENV);
// console.log(process.env.PATH);
// console.log(process.env.USERPROFILE);
// console.log(process.platform);

// 3. 运行状态：启动参数、PID、运行时间
// console.log(process.argv);
// console.log(process.argv0);
// console.log(process.argv1); // 只提供了argv0
// console.log(process.pid);
// console.log(process.uptime());

// 4. 事件 process 实现了 发布订阅
// process.on("exit", (code) => {
//   console.log("exit" + code);
// });
// process.on("beforeExit", (code) => {
//   console.log("beforeExit" + code);
// });
// console.log("over");
// process.exit(); // 主动退出 不执行 beforeExit

// 5. 标准输入输出 错误
// process.stdout 就是一个可写流， 内容输出到控制台上
// console.log = function (data) {
//   process.stdout.write("----" + data);
// };
// console.log(123);

// process.stdin.pipe(process.stdout);

// process.stdin.setEncoding("utf-8");
// process.stdin.on("readable", () => {
//   let chunk = process.stdin.read();
//   if (chunk) {
//     process.stdout.write("data---" + chunk);
//   }
// });
