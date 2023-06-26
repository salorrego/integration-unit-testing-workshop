import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookModel } from './data-access/books/book.model';
import { BooksRepository } from './data-access/books/books.repository';
import { connectionOptions } from './data-access/connection-options';
import { BooksService } from './domain/service/books.service';
import { AppController } from './entrypoint/api/app.controller';
import { BooksController } from './entrypoint/api/books.controller';

const entities = [BookModel];

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...connectionOptions, entities, migrations: [] }),
    TypeOrmModule.forFeature(entities),
  ],
  controllers: [AppController, BooksController],
  providers: [BooksRepository, BooksService],
})
export class AppModule {}
