import { HttpStatus } from '@nestjs/common';
import nock from 'nock';

import { closeServer, startServer } from '../../src/server';
import { getAxiosInstance } from '../test-helpers';
import { saveBook } from '../test-helpers';
import { get } from '../../config/convict';

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
    nock(`${get('thirdParty.url')}`)
      .get('/word')
      .reply(200, ['Mocked Upcoming']);

    await startServer();

    // Add books to the DB
    await saveAllBooks();
  });

  afterAll(async () => {
    // 🔚 Close server
    await closeServer();

    nock.cleanAll();
  });

  describe('/api/v1/books', () => {
    describe('GET', () => {
      describe('when the user gets all books', () => {
        test('then the service should return all books', async () => {
          //Act
          const booksResponse = await axios.get('api/v1/books');

          //Assert
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
    });

    describe('upcoming', () => {
      describe('GET', () => {
        describe('when the user gets upcoming book', () => {
          test('then the service should return upcoming book', async () => {
            //Act
            const booksResponse = await axios.get('api/v1/books/upcoming');

            //Assert
            expect(booksResponse).toMatchObject({
              status: HttpStatus.OK,
              data: 'Mocked Upcoming',
            });
          });
        });
      });
    });
  });
});
