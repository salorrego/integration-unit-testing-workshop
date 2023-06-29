import { Connection, EntityManager, Repository } from 'typeorm';
import { spy, restore, SinonSpy } from 'sinon';
import waitForExpect from 'wait-for-expect';

import { BooksService } from '../../src/domain/service/books.service';
import { BooksRepository } from '../../src/data-access/books/books.repository';
import { BookModel } from '../../src/data-access/books/book.model';
import { connectionOptions } from '../../src/data-access/connection-options';
import { Logger } from '../../src/utils/logger';

describe('(Unit) Books Service', () => {
  let booksService: BooksService;
  let loggerInfoSpy: SinonSpy;

  beforeAll(() => {
    loggerInfoSpy = spy(Logger, 'info');

    const con = new Connection(connectionOptions);
    const repository = new Repository(BookModel, new EntityManager(con));
    const booksRepository = new BooksRepository(repository);
    booksService = new BooksService(booksRepository);
  });

  afterAll(() => {
    restore();
  });

  describe('given the user is in the app', () => {
    describe('when the user runs api for process in the background', () => {
      test('then the service should run the process in the background', (done) => {
        //Arrange
        const book = {
          name: 'Node.js Design Patterns',
          author: 'Mario Casciaro',
          genre: 'Education',
          quantity: 15,
          totalAvailable: 15,
        };

        //Act
        booksService.processInBg(book);

        //Assert
        waitForExpect(
          () => {
            expect(loggerInfoSpy.args).toMatchObject(
              expect.arrayContaining([
                [`BooksService: Process in BG ${book.name}`],
              ]),
            );
            done();
          },
          5000,
          1000,
        );
      });
    });
  });
});
