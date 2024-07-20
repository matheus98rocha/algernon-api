import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { JwrAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TokenPayload } from '../auth/interfaces/token-payload.interface';
import { CreateBookDto } from './dto/create-books.dto';
import { UpdateBookDto } from './dto/update-books.dto';

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
  findAll(@CurrentUser() user: TokenPayload) {
    return this.booksService.findAll(user.userId);
  }

  @UseGuards(JwrAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: TokenPayload) {
    return this.booksService.findOne(+id, user.userId);
  }

  @UseGuards(JwrAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
    @CurrentUser() user: TokenPayload,
  ) {
    // TODO: Not working yet
    return this.booksService.update(+id, updateBookDto, user.userId);
  }

  @UseGuards(JwrAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: TokenPayload) {
    // TODO: Not working yet
    return this.booksService.remove(+id, user.userId);
  }
}
