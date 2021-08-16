const { SchemaDirectiveVisitor } = require("graphql-tools");
const { defaultFieldResolver } = require("graphql");
const { jwtSecret } = require("../config/config.default");
const jwt = require("../util/jwt");
const { AuthenticationError } = require("apollo-server-koa");

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async (parent, args, context, info) => {
      const { token, dataSources } = context;
      if (!token) throw AuthenticationError("未授权");
      try {
        const data = jwt.verify(token.split("Beara ")[1], jwtSecret);
        const user = await dataSources.users.findById(data.userId);
        context.user = user;
      } catch (error) {
        throw AuthenticationError("未授权");
      }
      const res = await resolve(parent, args, context, info);
      return res;
    };
  }
}
module.exports = AuthDirective;
