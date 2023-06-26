import { HttpStatus } from '@nestjs/common';

import { closeServer, startServer } from '../../src/server';
import { getAxiosInstance } from '../test-helpers';
import { saveBook } from '../test-helpers';

const books = [
  {
    name: "Harry Potter Philosopher's Stone",
    author: 'J. K. Rowling',
    genre: 'Fantasy',
    quantity: 3,
    totalAvailable: 1,
  },
  {
    name: 'Harry Potter Chamber of Secrets',
    author: 'J. K. Rowling',
    genre: 'Fantasy',
    quantity: 1,
    totalAvailable: 1,
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

const axios = getAxiosInstance();

describe('(Integration) Books', () => {
  beforeAll(async () => {
    await startServer();

    // Add books to the DB
    await saveAllBooks();
  });

  afterAll(async () => {
    // 🔚 Close server
    await closeServer();
  });

  test('api returns all books', async () => {
    const booksResponse = await axios.get('api/v1/books');
    expect(booksResponse).toMatchObject({
      status: HttpStatus.OK,
      data: expect.arrayContaining([
        expect.objectContaining({ id: expect.any(Number), ...books[0] }),
        expect.objectContaining({ id: expect.any(Number), ...books[1] }),
        expect.objectContaining({ id: expect.any(Number), ...books[2] }),
      ]),
    });
  });
});
