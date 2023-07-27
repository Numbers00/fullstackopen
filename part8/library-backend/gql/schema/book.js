const { GraphQLError } = require('graphql');
const { PubSub } = require('graphql-subscriptions');

const pubsub = new PubSub();

const Author = require('../../models/author');
const Book = require('../../models/book');

const typeDefs = `
  type Book {
    id: ID!
    author: Author!
    title: String!
    published: Int!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
  }

  type Mutation {
    addBook(
      title: String!,
      author: String!,
      published: Int!,
      genres: [String!]!
    ): Book
  }

  type Subscription {
    bookAdded: Book!
  }
`;

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
      console.log('createdBook', createdBook);

      const detailedBook = {
        ...createdBook._doc,
        id: createdBook._id,
        author: {
          ...author._doc,
          id: author._id
        }
      };
      console.log('detailedBook', detailedBook);
      pubsub.publish('BOOK_ADDED', { bookAdded: detailedBook });

      return detailedBook;
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
};

module.exports = { typeDefs, resolvers };
