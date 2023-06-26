import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { ApiResponseProperty } from '@nestjs/swagger';

@Entity('books')
export class BookModel {
  @ApiResponseProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiResponseProperty()
  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Index()
  @ApiResponseProperty()
  @Column({ name: 'author', type: 'varchar' })
  author: string;

  @Index()
  @ApiResponseProperty()
  @Column({ name: 'genre', type: 'varchar' })
  genre: string;

  @ApiResponseProperty()
  @Column({ name: 'quantity', type: 'int', default: 1 })
  quantity: number;

  @ApiResponseProperty()
  @Column({ name: 'totalAvailable', type: 'int', default: 1 })
  totalAvailable: number;

  @ApiResponseProperty()
  @Column({ name: 'createdAt', type: 'timestamptz', default: () => `now()` })
  createdAt?: Date;

  @ApiResponseProperty()
  @Column({ name: 'updatedAt', type: 'timestamptz', default: () => `now()` })
  updatedAt?: Date;
}
