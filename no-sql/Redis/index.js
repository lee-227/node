const express = require("express");
const bodyParser = require("body-parser");
const Redis = require("ioredis");
const app = express();
const redis = new Redis({
  port: 6379,
  host: "106.75.254.155",
  password: "l874591708@",
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
let number = 0;
app.get("/", async (req, res, next) => {
  try {
    const { user, type = "all" } = req.query;
    if (!user) throw new Error("缺少参数 user");
    if (type !== "male" && type !== "female" && type !== "all")
      throw new Error("参数 type 值只允许为 male 或 female 或 all");
    let ret;
    if (type === "male") {
      ret = await redis.srandmember("males");
    } else if (type === "female") {
      ret = await redis.srandmember("females");
    } else {
      ret = await redis.srandmember("all");
    }
    ret = await redis.hgetall(ret);
    res.status(200).json({
      code: 1,
      msg: ret,
    });
  } catch (error) {
    next(error);
  }
});
app.post("/", async (req, res, next) => {
  try {
    const { owner, type, content, time = Date.now() } = req.body;
    if (!owner) throw new Error("缺少参数 owner");
    if (!type) throw new Error("缺少参数 type");
    if (type !== "male" && type !== "female")
      throw new Error("参数 type 值只允许为 male 或 female");
    if (!content) throw new Error("缺少参数 content");
    let key = "data:" + ++number;
    if (type === "male") {
      redis.sadd("males", key);
    } else {
      redis.sadd("females", key);
    }
    redis.sadd("all", key);
    redis.hset(key, {
      owner,
      type,
      content,
      time,
    });
    res.status(200).json({ code: 1, msg: "你成功扔出了一个漂流瓶~" });
  } catch (error) {
    next(error);
  }
});
app.use((err, req, res, next) => {
  res.status(500).json({ code: 0, msg: err.message });
});
app.listen(8888, "0.0.0.0", () => {
  console.log("http://localhost:8888");
});
