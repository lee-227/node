## 事件环的执行顺序
1. 先从上至下执行所有的同步代码
2. 执行过程中将遇到的宏任务跟微任务按照顺序依次加入对应的队列中
3. 同步代码执行完毕之后，在微任务队列中依次取出所有满足条件的微任务回调执行
4. 清空微任务队列后，在宏任务队列中依次取出满足条件的宏任务回调执行
5. 循环事件环操作
6. 每个宏任务完成都会先清空满足条件的微任务队列

## node 事件环中的组成部分
1. timer：执行 setTimeout setInterval 回调
2. pending callbacks：执行系统操作的回调，例如 tcp udp
3. idle，prepare：node 系统内部进行使用
4. poll：执行 I/O 相关的回调
5. check：执行 setImmediate 回调
6. close callback：执行 close 事件的回调

## node 事件环执行顺序
1. 执行同步代码，将不同的任务添加至对应的任务队列
2. 同步代码执行完毕之后，执行满足条件的微任务队列
3. 清空微任务队列之后，执行timer队列中的已满足的宏任务
4. timer中所有宏任务执行完成之后依次切换队列
5. 每个宏任务完成都会先清空满足条件的微任务队列
6. process.nextTick 是优先级最高的微任务，同一队列中先执行nextTick

## node 跟 浏览器 事件循环的区别
1. 队列数量不同
   1. 浏览器只有 宏任务队列 微任务队列两个
   2. node 中除了微任务队列之外，还有六个事件队列存储对应的宏任务
2. process.nextTick 优先于普通微任务执行

## 注意
- setTimeout 跟 setImmediate 执行顺序是不确定的，存在两种情况
  1. 因为setTimeout 存在延迟，可能执行时还未放入timer队列，导致队列先切换到check队列先执行 setImmediate。
  2. 执行时已经放到timer队列中，先执行timer队列中的 setTimeout 在执行check队列中的 setImmediate
- 当 setTimeout setImmediate 都放到 I/O 回调中执行时，顺序是确定的，I/O 在 poll 队列执行，poll 执行完毕后先执行 check 中的setImmediate，在执行 timer 中的setTimeout