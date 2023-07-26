const { mergeTypeDefs, mergeResolvers } = require('@graphql-tools/merge');

const { typeDefs: AuthorTypes, resolvers: AuthorResolvers } = require('./author');
const { typeDefs: BookTypes, resolvers: BookResolvers } = require('./book');
const { typeDefs: UserTypes, resolvers: UserResolvers } = require('./user');

const OtherTypes = `
  type Token {
    value: String!
  }
`;

const typeDefs = [AuthorTypes, BookTypes, UserTypes, OtherTypes];
const resolvers = [AuthorResolvers, BookResolvers, UserResolvers];
module.exports = {
  typeDefs: mergeTypeDefs(typeDefs),
  resolvers: mergeResolvers(resolvers)
};
