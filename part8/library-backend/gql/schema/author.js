const { GraphQLError } = require('graphql');

const Author = require('../../models/author');
const Book = require('../../models/book');

const typeDefs = `
  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    authorCount: Int!
    allAuthors: [Author!]!
  }

  type Mutation {
    editAuthor(
      name: String!,
      setBornTo: Int!
    ): Author
  }
`;

const resolvers = {
  Query: {
    authorCount: async () => await Author.collection.countDocuments(),
    allAuthors: async () => await Author.find({})
  },
  Mutation: {
    editAuthor: async (root, args, context) => {
      const { user } = context;
      if (!user)
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        });
      
      if (args.setBornTo >= (new Date()).getFullYear())
        throw new GraphQLError('Invalid birth year', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.setBornTo
          }
        });

      const author = await Author.findOne({ name: args.name });
      if (!author) return null;

      author.born = args.setBornTo;
      return await author.save();
    }
  },
  Author: {
    bookCount: async ({ _id }, args, { loaders }) => loaders.authorLoader.load(_id)
  }
};

module.exports = { typeDefs, resolvers };
