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
          // Act
          const booksResponse = await axios.get('api/v1/books');

          // Assert
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

      describe('when the user gets all books filtering by name', () => {
        test('then the service should return all books filtered', async () => {
          // Act
          const booksResponse = await axios.get('api/v1/books?name=absa');

          // Assert
          expect(booksResponse).toMatchObject({
            status: HttpStatus.OK,
            data: expect.arrayContaining([
              expect.not.objectContaining({
                id: expect.any(Number),
                ...books[0],
              }),
              expect.not.objectContaining({
                id: expect.any(Number),
                ...books[1],
              }),
              expect.objectContaining({ id: expect.any(Number), ...books[2] }),
            ]),
          });
        });

        describe('and no books match filter name', () => {
          test('then the service should return books not found', async () => {
            // Act
            const booksResponse = await axios.get(
              'api/v1/books?name=jhgfdsrtg',
            );

            // Assert
            expect(booksResponse).toMatchObject({
              status: HttpStatus.NOT_FOUND,
              data: { message: 'No books found for your params' },
            });
          });
        });
      });
    });

    describe('POST', () => {
      describe('when the user adds a new book to the library', () => {
        test('then the service should create the book and return it', async () => {
          // Arrange
          const bookToSave = {
            name: 'Node.js Design Patterns',
            author: 'Mario Casciaro',
            genre: 'Education',
            quantity: 15,
            totalAvailable: 15,
          };

          // Act
          const savedBookResponse = await axios.post(
            'api/v1/books',
            bookToSave,
          );

          // Assert
          expect(savedBookResponse).toMatchObject({
            status: HttpStatus.CREATED,
            data: expect.objectContaining({
              id: expect.any(Number),
              ...bookToSave,
            }),
          });

          const allBooksResponse = await axios.get('api/v1/books');
          expect(allBooksResponse).toMatchObject({
            status: HttpStatus.OK,
            data: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(Number),
                ...bookToSave,
              }),
            ]),
          });
        });
      });

      describe('when the user tries to add a new book to the library with invalid data', () => {
        test('then the service should return bad request', async () => {
          // Arrange
          const bookToSave = {
            name: 'Node.js Design Patterns',
            author: 'Mario Casciaro',
            genre: 'Education',
          };

          // Act
          const savedBookResponse = await axios.post(
            'api/v1/books',
            bookToSave,
          );

          // Assert
          expect(savedBookResponse).toMatchObject({
            status: HttpStatus.BAD_REQUEST,
            data: {
              message: [
                'quantity must be a positive number',
                'quantity must be an integer number',
                'totalAvailable must be a positive number',
                'totalAvailable must be an integer number',
              ],
            },
          });
        });
      });
    });

    describe('/:bookId/reserve', () => {
      describe('POST', () => {
        describe('when the user tries to reserve a book', () => {
          test('then the service should reserve the book and return it', async () => {
            // Arrange
            const books = (await axios.get('api/v1/books')).data;

            // Act
            const reserveBookResponse = await axios.post(
              `api/v1/books/${books[0].id}/reserve`,
            );

            // Assert
            expect(reserveBookResponse).toMatchObject({
              status: HttpStatus.CREATED,
              data: expect.objectContaining({
                ...books[0],
                totalAvailable: books[0].totalAvailable - 1,
              }),
            });
          });
        });

        describe('when the user tries to reserve an unexisting book', () => {
          test('then the service should return not found', async () => {
            // Act
            const reserveBookResponse = await axios.post(
              `api/v1/books/9999999/reserve`,
            );

            // Assert
            expect(reserveBookResponse).toMatchObject({
              status: HttpStatus.NOT_FOUND,
              data: {
                message: `Book 9999999 not found, please check your params`,
              },
            });
          });
        });

        describe('when the user tries to reserve a boon that is unavailable', () => {
          test('then the service should return conflict', async () => {
            // Arrange
            const bookToSave = {
              name: 'Book for reserve conflict test',
              author: 'test',
              genre: 'Test',
              quantity: 1,
              totalAvailable: 1,
            };
            const bookSaved = (await axios.post(`api/v1/books`, bookToSave))
              .data;
            await axios.post(`api/v1/books/${bookSaved.id}/reserve`);

            // Act
            const reserveBookResponse = await axios.post(
              `api/v1/books/${bookSaved.id}/reserve`,
            );

            // Assert
            expect(reserveBookResponse).toMatchObject({
              status: HttpStatus.CONFLICT,
              data: {
                message: `All ${bookSaved.name} books have been reserved`,
              },
            });
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
