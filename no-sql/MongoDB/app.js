const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const mongoURI = "mongodb://106.75.254.155:27017";
const dbClient = new MongoClient(mongoURI);

const server = express();
server.use(express.json());

server.get("/", (req, res) => {
  res.end("hello express");
});
server.post("/articles", async (req, res, next) => {
  try {
    let { article } = req.body;
    if (!article || !article.title || !article.description || !article.body) {
      return res.status(422).json({
        error: "请求参数不符合规则要求",
      });
    }
    await dbClient.connect();
    const collection = dbClient.db("test").collection("articles");
    article.createAt = new Date();
    article.updateAt = new Date();
    let ret = await collection.insertOne(article);
    article._id = ret.insertedId;
    res.status(201).json({
      article,
    });
  } catch (error) {
    next(error);
  }
});
server.get("/articles", async (req, res, next) => {
  try {
    let { pageNum = 1, pageSize = 10 } = req.query;
    pageNum = parseInt(pageNum);
    pageSize = parseInt(pageSize);
    await dbClient.connect();
    const collection = dbClient.db("test").collection("articles");
    const ret = await collection
      .find()
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);
    const count = await collection.countDocuments();
    res.status(200).json({
      data: await ret.toArray(),
      count,
    });
  } catch (error) {
    next(error);
  }
});
server.get("/article/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    await dbClient.connect();
    const collection = dbClient.db("test").collection("articles");
    const ret = await collection.findOne({
      _id: ObjectId(id),
    });
    res.status(200).json({
      data: ret,
    });
  } catch (error) {
    next(error);
  }
});
server.put("/article/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    let { article: data } = req.body;
    await dbClient.connect();
    const collection = dbClient.db("test").collection("articles");
    await collection.updateOne(
      {
        _id: ObjectId(id),
      },
      {
        $set: data,
      },
    );
    const article = await collection.findOne({
      _id: ObjectId(id),
    });
    res.status(200).json({
      data: article,
    });
  } catch (error) {
    next(error);
  }
});
server.delete("/article/:id", async (req, res, next) => {
  try {
    let { id } = req.params;
    await dbClient.connect();
    const collection = dbClient.db("test").collection("articles");
    await collection.deleteOne({
      _id: ObjectId(id),
    });
    res.status(200).json({
      data: "删除成功",
    });
  } catch (error) {
    next(error);
  }
});
server.use((error, req, res, next) => {
  res.status(500).json({
    error: error.message,
  });
});
server.listen(8888, () => {
  console.log("http://localhost:8888");
});
