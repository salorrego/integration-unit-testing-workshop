import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { BookModel } from './book.model';

@Injectable()
export class BooksRepository {
  constructor(
    @InjectRepository(BookModel)
    private booksRepository: Repository<BookModel>,
  ) {}

  async findAll(name?: string): Promise<BookModel[]> {
    const books = name
      ? this.booksRepository.find({
          where: {
            name: Raw(
              (alias) => `LOWER(${alias}) LIKE '%${name.toLowerCase()}%'`,
            ),
          },
        })
      : this.booksRepository.find();
    return books;
  }

  async findOne(id: number): Promise<BookModel | null> {
    return this.booksRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.booksRepository.delete(id);
  }

  async saveBook(book: BookModel): Promise<BookModel> {
    return this.booksRepository.save(book);
  }

  async updateBook(book: BookModel): Promise<BookModel> {
    await this.booksRepository.update({ id: book.id }, book);
    return this.findOne(book.id);
  }
}
