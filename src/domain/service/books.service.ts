import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BookModel } from '../../data-access/books/book.model';
import { BooksRepository } from '../../data-access/books/books.repository';
import { Logger } from '../../utils/logger';
import { CreateBookRequest } from '../entities/create-book-request';
import axios from 'axios';

@Injectable()
export class BooksService {
  constructor(private readonly booksRepository: BooksRepository) {}

  async getAllBooks(name?: string): Promise<BookModel[]> {
    let books: BookModel[];

    try {
      Logger.debug(
        `BooksService: About to get all books${
          name ? ` by name: ${name}` : ''
        }`,
      );
      books = await this.booksRepository.findAll(name);
    } catch (error) {
      Logger.error(
        `BooksService: Something went wrong while getting all books, error ${error.message}, stack ${error.stack}`,
      );
      throw new HttpException(
        'Something went wrong while getting all books',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (books.length === 0) {
      throw new HttpException(
        'No books found for your params',
        HttpStatus.NOT_FOUND,
      );
    }

    return books;
  }

  async getUpcoingBook(): Promise<string>{
    const upcomingBookResponse = await axios.get('https://random-word-api.herokuapp.com/word', {
      validateStatus: () => true
    })

    if(upcomingBookResponse.status < HttpStatus.BAD_REQUEST){
      return upcomingBookResponse.data[0]
    }

    throw new HttpException(
      'No upcoming books',
      HttpStatus.NOT_FOUND,
    );
  }

  async createBook(book: CreateBookRequest): Promise<BookModel> {
    if (book.quantity < book.totalAvailable) {
      throw new HttpException(
        'totalAvailable cannot be greater than quantity',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      Logger.debug(`BooksService: About to create new book ${book.name}`);
      const bookToSave = new BookModel();
      bookToSave.name = book.name;
      bookToSave.author = book.author;
      bookToSave.genre = book.genre;
      bookToSave.quantity = book.quantity;
      bookToSave.totalAvailable = book.totalAvailable;

      return await this.booksRepository.saveBook(bookToSave);
    } catch (error) {
      Logger.error(
        `BooksService: Something went wrong while saving book ${book.name}, error ${error.message}, stack ${error.stack}`,
      );
      throw new HttpException(
        'Something went wrong while saving...',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async reserveBook(bookId: number): Promise<BookModel> {
    let book: BookModel;

    try {
      book = await this.booksRepository.findOne(bookId);
    } catch (error) {
      Logger.error(
        `BooksService: Something went wrong while reserving book ${bookId}, error ${error.message}, stack ${error.stack}`,
      );
      throw new HttpException(
        `Something went wrong while reserving book ${bookId}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!book) {
      throw new HttpException(
        `Book ${bookId} not found, please check your params`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (book.totalAvailable === 0) {
      throw new HttpException(
        `All ${book.name} books have been reserved`,
        HttpStatus.CONFLICT,
      );
    }

    book.totalAvailable--;

    const bookReserved = await this.booksRepository.updateBook(book);

    Logger.debug(`BooksService: Book ${book.name} reserved successfully`);

    return bookReserved;
  }
}
