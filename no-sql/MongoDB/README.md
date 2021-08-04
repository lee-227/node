## 特点
- 文档型数据库
- 高性能
- 灵活性
- 可扩展性
- 强大的查询语言
- 优异的性能
- 高性能：使用嵌入数据时，减少系统的IO负担，支持子文档查询。
- 多种查询类型支持，聚合查询，文本检索，地址位置查询等
- 高可用，水平扩展：支持副本集与分片
- 多种存储引擎

## 适用场景
1. 需要处理大量的低价值数据，且对数据处理性能有较高的要求
2. 需要借助缓存层来处理数据
3. 需要高度的可伸缩性

## 数据库操作
- show dbs 查看数据库列表
- db 查看当前数据库
- use <DATABASE_NAME> 创建/切换数据库
- db.dropDatabase() 删除当前数据库

## 集合
- db.myNewCollection2.insert( { x: 1 } ) 如果不存在集合，则在您第一次为该集合存储数据时，MongoDB 会创建该集合。
- show collections 查看集合
- db.集合名称.drop() 删除集合
  
## 文档
- 创建文档
```js
db.inventory.insertOne(
   { item: "canvas", qty: 100, tags: ["cotton"], size: { h: 28, w: 35.5, uom: "cm" } }
)
db.inventory.insertMany([
   { item: "journal", qty: 25, tags: ["blank", "red"], size: { h: 14, w: 21, uom: "cm" } },
   { item: "mat", qty: 85, tags: ["gray"], size: { h: 27.9, w: 35.5, uom: "cm" } },
   { item: "mousepad", qty: 25, tags: ["gel", "blue"], size: { h: 19, w: 22.85, uom: "cm" } }
])
```
- 查询文档
```js
db.inventory.find( {} ) // 查询所有文档

db.myCollection.find().pretty() // 格式化打印结果

db.inventory.find({}, {
  item: 1,
  qty: 1
}) // 指定返回的文档字段

db.inventory.find( { status: "D" } ) // 相等条件查询

db.inventory.find( { status: "A", qty: { $lt: 30 } } ) // 检索状态为“A”且数量小于（$ lt）30的清单集合中的所有文档

// 使用 $or 运算符，您可以指定一个复合查询，该查询将每个子句与一个逻辑或连接相连接，以便该查询选择集合中至少匹配一个条件的文档。
db.inventory.find({
  $or: [
    { status: "A" },
    { qty: { $lt: 30 } }
  ]
}) // 检索状态为 A 或数量小于 $lt30 的集合中的所有文档

db.inventory.find({
  status: "A",
  $or: [ { qty: { $lt: 30 } }, { item: /^p/ } ]
}) // 状态为“ A”且qty小于（$ lt）30或item以字符p开头的所有文档

db.inventory.find( { status: { $in: [ "A", "D" ] } } ) // 从状态为“A”或“D”清单集中检索所有文档

// 查询嵌套文档
db.inventory.find({
  size: { h: 14, w: 21, uom: "cm" }
}) // 查询选择字段 size 等于文档 {h: 14, w: 21, uom: "cm"} 的所有文档

db.inventory.find({
  "size.uom": "in"
}) // 选择嵌套在 size 字段中的 uom 字段等于 "in"  的所有文档

db.inventory.find({
  "size.h": { $lt: 15 }
}) // 查询在 size 字段中嵌入的字段 h 上使用小于运算符 $lt

db.inventory.find({
  "size.h": { $lt: 15 },
  "size.uom": "in",
  status: "D"
}) // 查询选择嵌套字段 h 小于 15，嵌套字段 uom 等于 "in"，状态字段等于 "D" 的所有文档

// 匹配数组
db.inventory.find({
  tags: ["red", "blank"]
}) // 查寻按指定顺序恰好具有两个元素 "red" 和 "blank" 的数组

db.inventory.find({
  tags: { $all: ["red", "blank"] }
}) // 同时包含元素 "red" 和 "blank" 的数组，而不考虑顺序或该数组中的其他元素，请使用 $all 运算符

db.inventory.find({
  tags: "red"
}) // 查询 tag 是一个包含字符串 "red" 作为其元素之一的数组

db.inventory.find({
  dim_cm: { $gt: 25 }
}) // 查询数组 dim_cm 包含至少一个值大于 25 的元素的所有文档

// 一个元素可以满足大于 15 的条件，而另一个元素可以满足小于 20 的条件；
// 或者单个元素可以满足以下两个条件
db.inventory.find( { dim_cm: { $gt: 15, $lt: 20 } } ) 

db.inventory.find({
  dim_cm: { $elemMatch: { $gt: 22, $lt: 30 } }
}) // 查询在 dim_cm 数组中包含至少一个同时 大于22  和 小于30 的元素的文档

db.inventory.find( { "dim_cm.1": { $gt: 25 } } ) // 查询数组 dim_cm 中第二个元素大于 25 的所有文档

db.inventory.find( { "tags": { $size: 3 } } ) // 查询数组标签具有3个元素的文档

db.inventory.find({
  "instock": { warehouse: "A", qty: 5 }
}) // 选择 instock 数组中的元素与指定文档匹配的所有文档 整个嵌入式/嵌套文档上的相等匹配要求与指定文档（包括字段顺序）完全匹配

db.inventory.find( { 'instock.qty': { $lte: 20 } } ) // 查询所有 instock 数组中包含至少一个嵌入式文档的嵌入式文档，这些嵌入式文档包含值小于或等于20的字段qty

db.inventory.find( { 'instock.0.qty': { $lte: 20 } } ) // 查询 instock 数组的第一个元素是包含值小于或等于20的字段qty的文档

db.inventory.find( { "instock": { $elemMatch: { qty: 5, warehouse: "A" } } } ) // 查询 instock 数组中至少有一个嵌入式文档的文档，这些文档同时包含等于5的字段qty和等于A的字段 warehouse

db.inventory.find( { "instock.qty": { $gt: 10,  $lte: 20 } } ) // 查询匹配文档，其中嵌套在 instock 数组中的任何文档的qty字段都大于10，而数组中的任何文档（但不一定是同一嵌入式文档）的qty字段小于或等于20

db.inventory.find( { "instock.qty": 5, "instock.warehouse": "A" } ) // 查询 instock 数组中具有至少一个包含数量等于5的嵌入式文档和至少一个包含等于A的字段仓库的嵌入式文档（但不一定是同一嵌入式文档）的文档

db.inventory.find( { status: "A" }, { item: 1, status: 1 } ) // 在结果集中，在匹配的文档中仅返回item，status和默认情况下的 _id 字段

db.inventory.find( { status: "A" }, { item: 1, status: 1, _id: 0 } ) // 从结果中删除 _id 字段

db.inventory.find( { status: "A" }, { status: 0, instock: 0 } ) // 返回匹配文档中status和instock字段以外的所有字段

db.inventory.find(
   { status: "A" },
   { item: 1, status: 1, "size.uom": 1 }
) ||
db.inventory.find(
   { status: "A" },
   { item: 1, status: 1, size:{ uom: 1 } }
) // 返回嵌入式文档中的特定字段

db.inventory.find(
   { status: "A" },
   { "size.uom": 0 }
) // 禁止嵌入文档中的特定字段

db.inventory.find( { status: "A" }, { item: 1, status: 1, "instock.qty": 1 } ) // 返回 instock 数组中嵌套文档的 qty 字段

db.inventory.find( { status: "A" }, { item: 1, status: 1, instock: { $slice: -1 } } ) // 返回 instock 数组中从后像前数 1 个原素

db.inventory.find( { item: null } ) // 查询将匹配包含其值为 null 的 item 字段或不包含 item 字段的文档。

db.inventory.find( { item : { $type: 10 } } ) // 查询仅匹配包含 item 字段，其值为 null 的文档；即 item 字段的值为 BSON 类型为 Null（类型编号10）

db.inventory.find( { item : { $exists: false } } ) // 查询与不包含 item 字段的文档匹配
```
- 更新文档
```js
// 单个
db.inventory.updateOne(
   { item: "paper" },
   {
     $set: { "size.uom": "cm", status: "P" },
     $currentDate: { lastModified: true }
   }
)
// 使用 $set 运算符将 size.uom 字段的值更新为 cm，将状态字段的值更新为 P
// 使用 $currentDate 运算符将 lastModified 字段的值更新为当前日期。如果 lastModified 字段不存在，则 $currentDate 将创建该字段。

// 多个
db.inventory.updateMany(
   { "qty": { $lt: 50 } },
   {
     $set: { "size.uom": "in", status: "P" },
     $currentDate: { lastModified: true }
   }
)

// 替换 要替换 _id 字段以外的文档的全部内容，请将一个全新的文档作为第二个参数传递
db.inventory.replaceOne(
   { item: "paper" },
   { item: "paper", instock: [ { warehouse: "A", qty: 60 }, { warehouse: "B", qty: 40 } ] }
)
```

- 删除文档
```js
db.inventory.deleteMany({}) // 删除所有文档
db.inventory.deleteMany({ status : "A" }) // 从状态字段等于“A”的清单集合中删除所有文档
db.inventory.deleteOne( { status: "D" } ) // 删除状态为“D”的第一个文档
```