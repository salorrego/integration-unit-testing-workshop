import { saveBook } from '../index';

const books = [
  {
    name: "Harry Potter Philosopher's Stone",
    author: 'J. K. Rowling',
    genre: 'Fantasy',
    quantity: 10,
    totalAvailable: 10,
  },
  {
    name: 'Harry Potter Chamber of Secrets',
    author: 'J. K. Rowling',
    genre: 'Fantasy',
    quantity: 10,
    totalAvailable: 10,
  },
  {
    name: 'Harry Potter Prisoner of Azkaban',
    author: 'J. K. Rowling',
    genre: 'Fantasy',
    quantity: 10,
    totalAvailable: 10,
  },
  {
    name: 'Harry Potter Goblet of Fire',
    author: 'J. K. Rowling',
    genre: 'Fantasy',
    quantity: 10,
    totalAvailable: 10,
  },
  {
    name: 'Harry Potter Order of the Phoenix',
    author: 'J. K. Rowling',
    genre: 'Fantasy',
    quantity: 10,
    totalAvailable: 10,
  },
  {
    name: 'Harry Potter Half-Blood Prince',
    author: 'J. K. Rowling',
    genre: 'Fantasy',
    quantity: 10,
    totalAvailable: 10,
  },
  {
    name: 'Harry Potter Deathly Hallows',
    author: 'J. K. Rowling',
    genre: 'Fantasy',
    quantity: 10,
    totalAvailable: 10,
  },
  {
    name: 'Absalom, Absalom',
    author: 'WILLIAM FAULKNER',
    genre: 'Fiction',
    quantity: 5,
    totalAvailable: 5,
  },
];

async function saveAllBooks() {
  console.log('About to start book seeding');
  for (const book of books) {
    await saveBook(book);
    console.log(`adding book: ${book.name}`);
  }
  console.log('books seeding done');
}

saveAllBooks();
