import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IBook } from './interface/book.types';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
  constructor(@InjectModel('Book') private bookModel: Model<CreateBookDto>) {}
  async create(createBookDto: CreateBookDto): Promise<IBook> {
    const newBook = this.bookModel.create(createBookDto);
    return newBook;
  }

  async findAll() {
    const books = await this.bookModel.find();
    return books;
  }

  async findOne(id: string) {
    const books = await this.bookModel.findById(id);
    return books;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<string> {
    await this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true });

    return 'Book patch successful';
  }

  async remove(id: string) {
    await this.bookModel.findByIdAndDelete(id);

    return 'Book deleted successful';
  }
}
