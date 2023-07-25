import { gql } from '@apollo/client';

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      id
      born
      bookCount
    }
  }
`;

export const ALL_BOOKS = gql`
  query allBooks {
    allBooks {
      title
      published
      author {
        name
        born
      }
      id
      genres
    }
  }
`;

export const FILTERED_BOOKS = gql`
  query filterBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      title
      published
      author {
        name
        born
      }
      id
      genres
    }
  }
`;

export const ME = gql`
  query {
    me {
      id
      username
      favoriteGenre
    }
  }
`;

// mutation name (createBook) and function name (addBook) can be same
// but function name has to follow the same name as declared in the server
export const ADD_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      published
      genres
      author {
        name
        born
      }
    }
  }
`;

export const UPDATE_BIRTHYEAR = gql`
  mutation updateBirthyear($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      bookCount
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value #token
    }
  }
`;
