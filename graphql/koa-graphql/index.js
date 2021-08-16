const { ApolloServer } = require("apollo-server-koa");
const Koa = require("koa");
const schema = require("./schema");
const dataSources = require("./data-sources");

async function startApolloServer(schema) {
  const server = new ApolloServer({
    schema,
    dataSources,
    context({ ctx }) {
      const token = ctx.request.header["authorization"];
      return {
        token,
      };
    },
  });
  await server.start();
  const app = new Koa();
  server.applyMiddleware({ app });
  await new Promise((resolve) => app.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  return { server, app };
}
startApolloServer(schema);
