import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IBook } from './interface/book.types';

@Injectable()
export class BookService {
  constructor(@InjectModel('Book') private bookModel: Model<CreateBookDto>) {}
  async create(createBookDto: CreateBookDto): Promise<IBook> {
    const newBook = new this.bookModel(createBookDto);
    const savedBook = await newBook.save();
    return savedBook;
  }

  async findAll() {
    const books = await this.bookModel.find();
    return books;
  }

  findOne(id: string) {
    const books = this.bookModel.findById(id);
    return books;
  }

  // update(id: number, updateBookDto: UpdateBookDto) {
  //   return `This action updates a #${id} book`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} book`;
  // }
}
