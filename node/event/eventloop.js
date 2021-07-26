// 浏览器
// 计算机里调度任务和分配任务的单位是进程
// 进程中包含着很多线程
// 浏览器是一个多进程模型 每个页签都是一个进程
// 主进程 =》 用户界面
// 渲染进程 =》 浏览器内核 js  ui渲染
// 处理请求 网络进程 绘图进程 GPU渲染启程 插件独立的进程

// 渲染进程  - 线程
// js的“主"线程是单线程的   ui渲染  ui渲染和js共用线程  互斥的  从上到下执行
// 事件、定时器、ajax 都是包含在进程中的
// new WebWorker webworker 工作线程和主线程不平等 （主线程能操作dom）

// 所有的异步方法 宏任务( 宿主环境提供的异步方法都是宏任务 ) 、 微任务 （语言本身提供的是微任务 promise.then、MutationObserver）
// 常见的宏任务 setTimeout setImmediate(IE支持)性能会高于setTimeout messageChannel requestFrameAnimation script ui  i/o 事件 ajax....
// 常见的微任务 ( mutationObserver promise.then , process.nextTick (queueMicrotask))
// 默认先执行宏任务 （script脚本）,会清空所有的微任务 (全部执行完毕) ,微任务执行后开始页面渲染（不是每次都渲染）,取出一个宏任务执行，执行过程中可能再次产生宏任务、微任务。。。不停的循环
Promise.resolve()
  .then(() => {
    console.log("then1");
    Promise.resolve()
      .then(() => {
        console.log("then1-1");
        return Promise.resolve(); // 两个then的间隔
        //  return {then(resolve){resolve()}}; // 只会有一个then的间隔
      })
      .then(() => {
        console.log("then1-2");
      });
  })
  .then(() => {
    console.log("then2");
  })
  .then(() => {
    console.log("then3");
  })
  .then(() => {
    console.log("then4");
  })
  .then(() => {
    console.log("then5");
  });
// 同步代码执行完毕后:
// 微任务队列 [then1]
// 1.清空微任务队列                    ---输出then1
// 微任务队列 j [then1-1,then2]
// 2.依次继续清空微任务队列             ---输出then1-1,then2
// 微任务队列 [NewPromiseResolveThenableJob，then3]
// 3.依次继续清空微任务队列             ---输出then3
// 微任务队列 [Promise.resolve().then,then4]
// 4.依次继续清空微任务队列             ---输出then4
// 微任务队列 [then1-2,then5]
// 4.依次继续清空微任务队列             ---输出then1-2 then5

// 在一个 pending 状态的 promise 对象（p）的 .then回调里返回一个 promise 对象（ p2），或者任意带有 then 方法的对象，引擎会专门起一个额外的 microtask/job 去执行这个 p2的 then 方法，
// 同时把 p 的 [[resolve]]和 [[reject]]函数作为参数传过去，虽然 p2 已经 fulfilled 了，
// 但它能做的也就是把 [[resolve]] 函数立刻放到 microtask 队列里，这样也就过了两个 microtask，这时 p 才会被 fulfill，
// p 后面的 console.log('内部第二个then')才会被放入队列。