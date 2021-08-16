const dbModel = require("../models");
const Users = require("./user");
const Article = require("./article");
module.exports = () => {
  return {
    users: new Users(dbModel.User),
    articles: new Article(dbModel.Article),
  };
};
