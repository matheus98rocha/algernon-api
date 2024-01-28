import { Injectable } from '@nestjs/common';
import { IBook } from '../interfaces/book.interface';

@Injectable()
export class CatsService {
  private readonly cats: IBook[] = [];

  create(cat: IBook) {
    this.cats.push(cat);
  }

  findAll(): IBook[] {
    return this.cats;
  }
}
