const DataLoader = require('dataloader');

const Book = require('../../models/book');

const authorLoader = new DataLoader(async authorIds => {
  const books = await Book.find({ author: { $in: authorIds } });
  const booksByAuthor = authorIds.map(a => books.filter(b => b.author.toString() === a.toString()));
  return booksByAuthor.map(b => b.length);
});

module.exports = { authorLoader };
