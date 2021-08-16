const { UserInputError } = require("apollo-server-koa");
const jwt = require("../util/jwt");
const { jwtSecret } = require("../config/config.default");
const md5 = require("../util/md5");

const resolvers = {
  Query: {
    foo() {
      return "hello";
    },
    async currentUser(parent, arg, { dataSources, user }) {
      return user;
    },
  },
  Mutation: {
    async createUser(parent, { user }, { dataSources }) {
      const users = dataSources.users;
      const user1 = await users.findByEmail(user.email);
      if (user1) {
        throw new UserInputError("邮箱已存在");
      }

      const user2 = await users.findByUsername(user.username);
      if (user2) {
        throw new UserInputError("用户已存在");
      }

      const userData = await users.saveUser(user);

      return {
        user: {
          ...userData.toObject(),
          token: "123",
        },
      };
    },
    async login(parent, { user }, { dataSources }) {
      const users = dataSources.users;
      const userData = await users.findByEmail(user.email);
      if (!userData) {
        throw new UserInputError("邮箱不存在");
      }
      if (md5(user.password) !== userData.password) {
        throw new UserInputError("密码错误");
      }
      const token = await jwt.sign({ userId: userData._id }, jwtSecret, {
        expiresIn: 60 * 60 * 24,
      });
      return {
        user: { ...userData.toObject(), token },
      };
    },
    async updateUser(parent, { user: params }, { dataSources, user }) {
      if (params.password) {
        params.password = md5(params.password);
      }
      const res = await dataSources.users.updateUser(user._id, params);
      return {
        user: res,
      };
    },
  },
};
module.exports = resolvers;
