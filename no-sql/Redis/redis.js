const Redis = require("ioredis");
const redis = new Redis({
  port: 6379,
  host: "106.75.254.155",
  password: "l874591708@",
});

(async () => {
  let res = await redis.set("lee", "me");
  console.log(res);
  // 回调函数式
  redis.get("lee", (err, val) => {
    console.log(err);
    console.log(val);
  });
  // promise 式
  redis
    .get("lee")
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
  // promise 式
  const res2 = await redis.get("lee");
  console.log(res2);

  // Pipelining
  // 如果要发送一批命令，则可以使用流水线将命令在内存中排队，然后将它们一次全部发送到 Redis。
  // 这样，性能提高了50％〜300％（请参阅基准测试部分）。

  //   const pipeline = redis.pipeline();
  //   pipeline.set("foo", "bar");
  //   pipeline.del("lee");
  //   pipeline.exec((err, results) => {
  //     console.log(err, results);
  //   });

  //   redis
  //     .pipeline()
  //     .set("foo", "bar")
  //     .del("lee")
  //     .exec((err, results) => {
  //       console.log(err, results);
  //     });

  //   const res3 = await redis.pipeline().set("foo", "bar").del("lee").exec();
  //   console.log(res3);

  //   redis
  //     .pipeline()
  //     .set("foo", "bar")
  //     .get("foo", (err, result) => {
  //       // 获取该命令得到的答复
  //       // result === 'bar'
  //     })
  //     .exec((err, result) => {
  //       // result[1][1] === 'bar'
  //     });

  //   const res4 = await redis
  //     .pipeline([
  //       ["set", "foo", "bar"],
  //       ["get", "foo"],
  //     ])
  //     .exec();
  //   console.log(res4);
  //   显示管道中有多少命令
  //   const length = redis.pipeline().set("foo", "bar").get("foo").length;

  // 事务
  // 大多数时候，事务命令 multi＆exec 与管道一起使用。
  // 因此，在调用 multi 时，默认情况下会自动创建 Pipeline 实例，因此您可以像使用管道一样使用 multi
  //   redis
  //     .multi()
  //     .set("foo", "bar")
  //     .get("foo")
  //     .exec((err, results) => {
  //       // results === [[null, 'OK'], [null, 'bar']]
  //     });
  // 如果事务的命令链中存在语法错误（例如，错误的参数数量，错误的命令名称等），则不会执行任何命令，并返回错误

  // 就接口而言，multi 与管道的区别在于，当为每个链接的命令指定回调时，排队状态将传递给回调，而不是命令的结果：
  //   redis
  //     .multi()
  //     .set("foo", "bar", (err, result) => {
  //       // result === 'QUEUED'
  //     })
  //     .exec(/* ... */);

  // 管道支持内联事务，这意味着您可以将管道中的命令子集分组为一个事务
  //   redis
  //     .pipeline() // 开启管道
  //     .get("foo")
  //     .multi() // 开启事务
  //     .set("foo", "bar")
  //     .get("foo")
  //     .exec() // 提交事务
  //     .get("foo")
  //     .exec(); // 提交管道

  // 错误处理
  // ioredis 提供了一个选项 showFriendlyErrorStack 来解决该问题。启用 showFriendlyErrorStack 时，ioredis 将为您优化错误堆栈
  // const redis = new Redis({ showFriendlyErrorStack: true });
  // 但是，优化错误堆栈会大大降低性能。因此，默认情况下，此选项是禁用的，只能用于调试目的。不建议在生产环境中使用此功能
})();
