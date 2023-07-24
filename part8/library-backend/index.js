const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { GraphQLError } = require('graphql');
const { v1: uuid } = require('uuid');

// let authors = [
//   {
//     name: 'Robert Martin',
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821
//   },
//   { 
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   { 
//     name: 'Sandi Metz', // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ];

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
*/

// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ['agile', 'patterns', 'design']
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'patterns']
//   },  
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'design']
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'crime']
//   },
//   {
//     title: 'The Demon ',
//     published: 1872,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'revolution']
//   },
// ];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Author = require('./models/author');
const Book = require('./models/book');

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => console.log('connected to MongoDB'))
  .catch((error) => console.log('error connecting to MongoDB:', error.message));

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    authorCount: Int!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!,
      author: String!,
      published: Int!,
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!,
      setBornTo: Int!
    ): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    // allBooks: (root, args) => {
    //   if (!args.author && !args.genre)
    //     return books;
    //   else if (args.author && !args.genre)
    //     return books.filter(b => b.author === args.author);
    //   else if (!args.author && args.genre)
    //     return books.filter(b => b.genres.includes(args.genre));
    //   else
    //     return books.filter(b => b.author === args.author && b.genres.includes(args.genre));
    // },
    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => Author.find({}),
  },
  Mutation: {
    addBook: async (root, args) => {
      try {
        let author;
        try {
          author = await (async () => {
            const author = await Author.findOne({ name: args.author });
            console.log('author', author);
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
        
        const book = new Book({ ...args, author: author._id.toString() });
        try {
          await book.save();
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

        return book;
      } catch (error) {
        console.log(error);
        return error.message;
      }
    },
    // editAuthor: (root, args) => {
    //   if (args.setBornTo >= (new Date()).getFullYear())
    //     throw new GraphQLError('Invalid birth year', {
    //       extensions: {
    //         code: 'BAD_USER_INPUT',
    //         invalidArgs: args.setBornTo
    //       }
    //     });

    //   const author = authors.find(a => a.name === args.name);
    //   if (!author) return null;

    //   const updatedAuthor = { ...author, born: args.setBornTo };
    //   authors = authors.map(a => a.name === args.name ? updatedAuthor : a);
    //   return updatedAuthor;
    // }
  },
  // Author: {
  //   bookCount: (root) => books.filter(b => b.author === root.name).length
  // }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
});
