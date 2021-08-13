## 概念
Express 是一个快速，简单，极简的 Node.js web 应用开发框架。通过它，可以轻松的构建各种 web 应用。

例如 接口服务，传统的 web 网站，开发工具集成等


Express 本身是极简的，仅仅提供了 web 开发的基础功能，但是它通过中间件的方式集成了许许多多的外部插件来处理 HTTP 请求。
- body-parser：解析 HTTP 请求体
- compression：压缩 HTTP 响应
- cookie-parser：解析 cookie 数据
- cors：处理跨域资源请求
- morgan：HTTP 请求日志记录

Express 中间件的特性固然强大，但是它所提供的灵活性是一把双刃剑。
1. 它让 Express 本身变得更加灵活和简单
2. 缺点在于虽然有一些中间件包可以解决几乎所有问题或需求，但是挑选合适的包有时也会成为一个挑战

Express 不对 Node.js 已有的特性进行二次抽象，只是在它之上扩展了 web 应用所需的基本功能。
- 内部使用的还是 http 模块
- 请求对象继承自：http.IncomingMessage
- 响应对象继承自：http.ServerResponse

## 特性
- 简单易学
- 丰富的基础 API 支持，以及常见的 HTTP 辅助程序，例如重定向、缓存等
- 强大的路由功能
- 灵活的中间件
- 高性能
- 非常稳定（它的源代码几乎百分百的测试覆盖率）
- 视图系统支持 14 个以上的主流模板引擎

## 应用场景
1. 传统的 Web 网站
2. 接口服务
3. 服务端渲染中间层
4. 开发工具

## 中间件
Express 的最大特色，也是最重要的一个设计，就是中间件。一个 Express 应用，就是由许许多多的中间件来完成的。

在我理解 Express 中间件和 AOP 面向切面编程就是一个意思，就是都需要经过经过的一些步骤，不去修改自己的代码，以此来扩展或者处理一些功能。

AOP（Aspect Oriented Programming）面向切面编程：
- 将日志记录，性能统计，安全控制，事务处理，异常处理等代码从业务逻辑代码中划分出来，通过对这些行为的分离，我们希望可以将它们**独立到非业务逻辑的方法中**，进而改变这些行为的时候**不影响业务逻辑的代码**。
- 利用 AOP 可以对业务逻辑的各个部分进行隔离，从而使得**业务逻辑各部分之间的耦合度降低**，提高**程序的可重用性**，同时提高了**开发的效率和可维护性**。

### 中间件分类
- 应用程序级别中间件
- 路由级别中间件
- 错误处理中间件
- 内置中间件
- 第三方中间件

要从路由器中间件堆栈中跳过其余中间件功能，请调用 next('route') 将控制权传递给下一条路由。

注意：next('route') 仅在使用 app.METHOD() 或 router.METHOD() 函数加载的中间件函数中有效。
```js
app.get('/user/:id', function (req, res, next) {
  // if the user ID is 0, skip to the next route
  if (req.params.id === '0') next('route')
  // otherwise pass the control to the next middleware function in this stack
  else next()
}, function (req, res, next) {
  // send a regular response
  res.send('regular')
})

// handler for the /user/:id path, which sends a special response
app.get('/user/:id', function (req, res, next) {
  res.send('special')
})
```
要跳过路由器的其余中间件功能，请调用next('router') 将控制权转回路由器实例。
```js
var express = require('express')
var app = express()
var router = express.Router()

// predicate the router with a check and bail out when needed
router.use(function (req, res, next) {
  if (!req.headers['x-auth']) return next('router')
  next()
})

router.get('/user/:id', function (req, res) {
  res.send('hello, user!')
})

// use the router and 401 anything falling through
app.use('/admin', router, function (req, res) {
  res.sendStatus(401)
})
```
Express 具有以下内置中间件函数：
- express.json()    解析 Content-Type 为 application/json 格式的请求体
- express.urlencoded()    解析 Content-Type 为 application/x-www-form-urlencoded 格式的请求体
- express.raw()    解析 Content-Type 为 application/octet-stream 格式的请求体
- express.text()    解析 Content-Type 为 text/plain 格式的请求体
- express.static()    托管静态资源文件

## 路由
路由路径可以是字符串，字符串模式或正则表达式。

字符?，+，*，和()是他们的正则表达式的对应的子集。连字符（-）和点（.）由基于字符串的路径按字面意义进行解释。

此路由路径将与acd和匹配abcd。
```js
app.get('/ab?cd', function (req, res) {
  res.send('ab?cd')
})
```

这条路线的路径将会匹配abcd，abbcd，abbbcd，等等
```js
app.get('/ab+cd', function (req, res) {
  res.send('ab+cd')
})
```

这条路线的路径将会匹配abcd，abxcd，abRANDOMcd，ab123cd，等。
```js
app.get('/ab*cd', function (req, res) {
  res.send('ab*cd')
})
```
此路由路径将与/abe和匹配/abcde。
```js
app.get('/ab(cd)?e', function (req, res) {
  res.send('ab(cd)?e')
})
```

**基于正则表达式的路由路径示例：**

此路由路径将匹配其中带有“a”的任何内容。
```js
app.get(/a/, function (req, res) {
  res.send('/a/')
})
```

这条路线的路径将匹配butterfly和dragonfly，但不butterflyman，dragonflyman等
```js
app.get(/.*fly$/, function (req, res) {
  res.send('/.*fly$/')
})
```
### 路径参数
连字符（-）和点（.）是按字面解释的，因此可以将它们与路由参数一起使用，以实现有用的目的。
```js
Route path: /flights/:from-:to
Request URL: http://localhost:3000/flights/LAX-SFO
req.params: { "from": "LAX", "to": "SFO" }

Route path: /plantae/:genus.:species
Request URL: http://localhost:3000/plantae/Prunus.persica
req.params: { "genus": "Prunus", "species": "persica" }
```

### 响应方法
- res.download（）	    提示要下载的文件。
- res.end（）           结束响应过程。
- res.json（）	    发送JSON响应。
- res.jsonp（）	    发送带有JSONP支持的JSON响应。
- res.redirect（）    重定向请求。
- res.render（）	    渲染视图模板。
- res.send（）	    发送各种类型的响应。
- res.sendFile（）	将文件作为八位字节流发送。
- res.sendStatus（）	设置响应状态代码，并将其字符串表示形式发送为响应正文。