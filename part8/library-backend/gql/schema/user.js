const { GraphQLError } = require('graphql');

const User = require('../../models/user');

const typeDefs = `
  type User {
    id: ID!
    username: String!
    favoriteGenre: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
    me: User
  }
`;

const resolvers = {
  Query: {
    me: (root, args, context) => context.user
  },
  Mutation: {
    createUser: async (root, args) => {
      try {
        const user = new User({ ...args });
        return await user.save();
      } catch (error) {
        console.log(error);
        throw new GraphQLError(`Error creating user: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: [args.username, args.favoriteGenre],
            error
          }
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== 'secret')
        throw new GraphQLError('wrong credentials', {
          extension: {
            code: 'BAD_USER_INPUT'
          }
        });

      const userForToken = {
        id: user._id,
        username: user.username
      };

      const token = jwt.sign(
        userForToken,
        process.env.SECRET
      );

      return { value: token };
    }
  }
}

module.exports = { typeDefs, resolvers };
