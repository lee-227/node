module.exports = {
  Article: {
    async author(parent, args, { dataSources }) {
      const user = await dataSources.users.findById(parent.author);
      return user;
    },
  },
  ArticlesPayload: {
    async articles({ offset, limit }, arg, { dataSources }) {
      const articles = await dataSources.articles.getArticles({
        offset,
        limit,
      });
      return articles;
    },
    async count(parent, args, { dataSources }) {
      const count = await dataSources.articles.getCount();
      return count;
    },
  },
  Query: {
    async articles(parent, { offset, limit }, { dataSources, user }) {
      return { offset, limit };
      //   const [articles, count] = await Promise.all([
      //     dataSources.articles.getArticles({ offset, limit }),
      //     dataSources.articles.getCount(),
      //   ]);
      //   return {
      //     articles,
      //     count,
      //   };
    },
  },
  Mutation: {
    async createArticle(parent, { article }, { dataSources, user }) {
      article.author = user._id;
      const res = await dataSources.articles.createArticle(article);
      return {
        article: res,
      };
    },
  },
};
