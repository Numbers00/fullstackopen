const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

const Author = require('../models/author');
const Book = require('../models/book');
const User = require('../models/user');

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (!args.author && !args.genre)
        return await Book.find({}).populate('author');
      else if (args.author && !args.genre) {
        const author = await Author.findOne({ name: args.author });
        if (!author) return null;

        const book = await Book.find({ author: author._id.toString() }).populate('author');
        return book;
      }
      else if (!args.author && args.genre && args.genre === 'all genres')
        return await Book.find({}).populate('author');
      else if (!args.author && args.genre)
        return await Book.find({ genres: { $in: [new RegExp(args.genre, 'i')] } }).populate('author');
      else if (args.author && args.genre && args.genre === 'all genres') {
        const author = await Author.findOne({ name: args.author });
        return await Book.find({ author: author._id.toString() }).populate('author');
      }
      else {
        const author = await Author.findOne({ name: args.author });
        return await Book.find({ author: author._id.toString(), genres: { $in: [new RegExp(args.genre, 'i')] } }).populate('author');
      }
    },
    authorCount: async () => await Author.collection.countDocuments(),
    allAuthors: async () => await Author.find({}),
    me: (root, args, context) => context.user
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const { user } = context;
      if (!user)
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        });

      let author;
      try {
        author = await (async () => {
          const author = await Author.findOne({ name: args.author });
          return author ? author : await (new Author({ name: args.author })).save();
        })();
      } catch (error) {
        console.log(error);
        throw new GraphQLError(`Error adding author: ${err.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
            error
          }
        });
      }
      
      let createdBook;
      try {
        const book = new Book({ ...args, author: author._id.toString() });
        createdBook = await book.save();
      } catch (error) {
        console.log(error);
        throw new GraphQLError(`Error adding book: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: [args.title, args.published, args.genres],
            error
          }
        });
      }

      return {
        ...createdBook._doc,
        author
      };
    },
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
    },
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
  },
  Author: {
    bookCount: async (root) => Book.find({ author: root._id.toString() }).countDocuments()
  }
};

module.exports = resolvers;
