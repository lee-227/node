const { gql } = require("apollo-server-koa");
const typeDefs = gql`
  directive @upper on FIELD_DEFINITION
  directive @auth on FIELD_DEFINITION

  type User {
    email: String!
    username: String!
    bio: String
    image: String
    token: String
    following: Boolean
  }

  type UserPayload {
    user: User
  }
  type ArticlesPayload {
    articles: [Article!]
    count: Int
  }
  type Query {
    foo: String @upper
    currentUser: User @auth
    articles(offset: Int = 0, limit: Int = 2): ArticlesPayload
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CreateUserInput {
    username: String!
    email: String!
    password: String!
  }

  input UpdateUserInput {
    email: String
    username: String
    password: String
    image: String
    bio: String
  }

  type Article {
    _id: String!
    title: String!
    description: String!
    body: String!
    tagList: [String!]
    createdAt: String!
    updatedAt: String!
    favorited: Boolean
    favoritesCount: Int
    author: User
  }

  input CreateArticleInput {
    title: String!
    description: String!
    body: String!
    tagList: [String!]
  }

  type CreateArticlePayload {
    article: Article
  }

  type Mutation {
    # User
    login(user: LoginInput): UserPayload
    createUser(user: CreateUserInput): UserPayload
    updateUser(user: UpdateUserInput): UserPayload @auth

    # Article
    createArticle(article: CreateArticleInput): CreateArticlePayload @auth
  }
`;
module.exports = typeDefs;
