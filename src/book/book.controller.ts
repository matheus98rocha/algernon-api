import {
  Post,
  Body,
  Controller,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { IBook } from './interface/book.types';

@Controller('book')
export class BookController {
  constructor(private readonly booksService: BookService) {}

  @Post()
  async create(@Body() bookData: CreateBookDto): Promise<IBook> {
    try {
      const createdBook = await this.booksService.create(bookData);
      return createdBook;
    } catch (error) {
      throw new HttpException(
        'Failed to create book',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  // @Get()
  // findAll() {
  //   return this.booksService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.booksService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
  //   return this.booksService.update(+id, updateBookDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.booksService.remove(+id);
  // }
}
