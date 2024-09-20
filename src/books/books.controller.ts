import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { JwrAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TokenPayload } from '../auth/interfaces/token-payload.interface';
import { CreateBookDto } from './dto/create-books.dto';
import { BookStatusBody, UpdateBookDto } from './dto/update-books.dto';
import {
  Pagination,
  PaginationParams,
} from '../decorators/pagination.decorator';
import { orderByOptions } from './helpers/order-by.helper';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(JwrAuthGuard)
  createBook(
    @Body() createBookDto: CreateBookDto,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.booksService.create(createBookDto, user.userId);
  }

  @Get()
  @UseGuards(JwrAuthGuard)
  findAll(
    @CurrentUser() user: TokenPayload,
    @PaginationParams() paginationParams: Pagination,
    @Query('status') status?: string,
    @Query('bookName') bookName?: string,
    @Query('isFavorite') isFavorite?: boolean,
    @Query('orderBy') orderBy?: orderByOptions,
  ) {
    return this.booksService.findAll(
      user.userId,
      paginationParams,
      status,
      bookName,
      isFavorite,
      orderBy,
    );
  }

  @UseGuards(JwrAuthGuard)
  @Get('get-by-id/:id')
  findOne(@Param('id') id: string, @CurrentUser() user: TokenPayload) {
    return this.booksService.findOne(+id, user.userId);
  }

  @UseGuards(JwrAuthGuard)
  @Patch('updateBook/:id')
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.booksService.update(+id, updateBookDto, user.userId);
  }

  @UseGuards(JwrAuthGuard)
  @Patch('updateBookStatus/:id')
  updateStatusBook(
    @Param('id') id: string,
    @Body() status: BookStatusBody,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.booksService.updateStatusBook(+id, status, user.userId);
  }

  @UseGuards(JwrAuthGuard)
  @Delete('delete-book/:id')
  remove(@Param('id') id: string, @CurrentUser() user: TokenPayload) {
    return this.booksService.remove(+id, user.userId);
  }

  @UseGuards(JwrAuthGuard)
  @Get('googleBookApi')
  async getBookFromGoogle(@Query('name') name: string) {
    const response = await this.booksService.getBookFromGoogleApi(name);
    return response;
  }
}
