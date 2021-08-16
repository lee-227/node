## GraphQL 
GraphQL 是一种针对 API 的查询语言，是一种标准。GraphQL 只定义了这种查询语言语法如何、具体的语句如何执行等。但是，你在真正使用某种 GraphQL 的服务端实现时，是有可能发现 GraphQL 标准中所描述的特性尚未被实现；或者这种 GraphQL 的实现扩展了 GraphQL 标准所定义的内容。

GraphQL的出现，并不是把REST一棍打死，完全可以两者并存，选择你认为更合适的方式解决对应的问题即可

## RESTFUL 问题
- 接口粒度比较细，很多场景需要调用多次请求才能完成一个功能
- 接口扩展、维护成本高
- 接口响应的数据格式无法预知（JSON 已经成为主流格式）

## GraphQL 与 RESTful 有什么区别？
1. 入口
   1. RESTful 的核心理念在于资源 (resource)，且讲究一个 RESTful 接口仅操作单一资源；因此在你使用 RESTful 时，会设计出大量的接口。
   2. GraphQL 是单一入口，一般配置在 [host]/graphql/，所有的资源都从该入口通过 graphql 的语句获取或修改（当然 GraphQL 亦支持多入口，但显然多入口的数量也远小于 RESTful）。
2. 数据的关联性
   1. RESTful 所操作的资源相对是离散的；而 GraphQL 的数据更有整体性。
   
举个例子，如果要获取 A 的朋友的朋友，用 RESTful 该怎么做呢？

假设我们有这样一个接口：
```
GET /user/:userId/friends/
```
而 A 有 20 个好朋友，那么我们总共需要发送 20 + 1 = 21 次 REST 请求。

或者我们为了这种特殊场景设计出以下接口：
```
GET /user/:userId/friendsAndHisFriends/
```
虽然看起来很别扭，但是只需要一次请求

在 GraphQL 中，怎么做？

首先我们需要给 User 定义 Schema
```
type User {
  id: ID!
  name: String!
  friends: [User]
}
```
假设我们在 Graph root 上只挂了一个 Node，叫 user:
```
type Query {
  user(id: ID!): User
}
```
那么我们从客户端发送的 query 就可以写成这样：
```
query ($userId: ID) {
  user(id: $userId) {
    name
    friends {
      name
      friends {
        name
      }
    }
  }
}
```
这一个请求就搞定查询朋友的朋友这个蛋疼的需求,并且可以无限循环的写下去

## GraphQL 与 RESTful 相比有什么优点？
1. 数据冗余和请求冗余 (overfetching & underfetching)
   1. overfetching 只想获取某几个字段而后端却传来了多余的字段造成带宽浪费
   2. underfetching 获取多个详情时却需要发送多个请求获取最终数据 API 响应没有合理的包含足够信息
2. 灵活而强类型的schema
   1. GraphQL是强类型的。也就是说，我们在定义schema时，类似于使用SQL，是显式地为每一个域定义类型的，我们就可以更方便的检查类型问题
3. 接口校验 (validation)
   1. 显而易见，由于强类型的使用，我们对收到的数据进行检验的操作变得更为容易和严格，自动化的简便度和有效性也大大提高。对query本身的结构的校验也相当于是在schema完成后就自动得到了，所以我们甚至不需要再引入任何别的工具或者依赖，就可以很方便地解决所有的validation。
4. 接口变动，维护与文档
   1. RESTful Application里面，一旦要改动API，不管是增删值域，改变值域范围，还是增减API数量，改变API url，都很容易变成伤筋动骨的行为。
   2. 相比之下，GraphQL就轻松多了。GraphQL的Service，API endpoint很可能就只有一个，根本不太会有改动URL path的情况。至始至终，数据的请求方都只需要说明自己需要什么内容，而不需要关心后端的任何表述和实现。数据提供方，比如server，只要提供的数据是请求方的母集，不论它们各自怎么变，都不需要因为对方牵一发而动全身。
   3. 在现有工具下，REST API的文档没有到过分难以编写和维护的程度，不过跟可以完全auto-generate并且可读性可以很好地保障的GraphQL比起来，还是略显逊色——毕竟GraphQL甚至不需要我们费力地引入多少其他的工具。


## 介绍
GraphQL 既是一种用于 API 的查询语言也是一个满足你数据查询的运行时。 GraphQL 对你的 API 中的数据提供了一套易于理解的完整描述，使得客户端能够准确地获得它需要的数据，而且没有任何冗余，也让 API 更容易地随着时间推移而演进，还能用于构建强大的开发者工具。

传统的 API 调用一般获取到的是后端组装好的一个完整对象，而前端可能只需要用其中的某些字段，大部分数据的查询和传输工作都浪费了。GraphQL 提供一种全新数据查询方式，可以只获取需要的数据，使 API 调用更灵活、高效和低成本。

## GraphQL 模式和类型
### Query 类型
- Query 类型是客户端默认的查询类型
- Query 类型必须存在
- Query 是唯一的，不能重复定义

### 基本类型
- Int：有符号 32 位整数。
- Float：有符号双精度浮点值。
- String：UTF‐8 字符序列。
- Boolean：true 或者 false。
- ID：ID 标量类型表示一个唯一标识符，通常用以重新获取对象或者作为缓存中的键。ID 类型使用和 String 一样的方式序列化；然而将其定义为 ID 意味着并不需要人类可读性。

类型的作用：
- 约束数据格式，防止出现不合理数据
- 如果数据可以合理的转换为对应的数据类型则不会报错，例如字符串 "123" 可以被合理的转换为数字 123

### 对象
```
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type Query {
    getDie(numSides: Int): RandomDie
  }
```

### 列表类型
```
# 这表示数组本身可以为空，但是其不能有任何空值成员。
myField: [String!]

# 不可为空的字符串数组
myField: [String]!

# 数组本身不能为空，其中的数据也不能为空
myField: [String!]!
```

### 非空类型
- 默认情况下，每个类型都是可以为空的，意味着所有的标量类型都可以返回 null
- 使用感叹号可以标记一个类型不可为空，如 String! 表示非空字符串
- 如果是列表类型，使用方括号将对应类型包起来，如 [Int] 就表示一个整数列表。

### 枚举类型
```
enum Episode {
  NEWHOPE
  EMPIRE
  JEDI
}
```

