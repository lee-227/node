const { makeExecutableSchema } = require("graphql-tools");
const typeDefs = require("./type-defs");
const userResolvers = require("./resolvers/user");
const articleResolvers = require("./resolvers/article");
const schema = makeExecutableSchema({
  typeDefs,
  resolvers: [userResolvers, articleResolvers],
  schemaDirectives: {
    upper: require("./schema-directives/upper"),
    auth: require("./schema-directives/auth"),
  },
});
module.exports = schema;
