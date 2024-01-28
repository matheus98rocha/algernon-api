import { Controller, Get } from '@nestjs/common';

@Controller('books')
export class CatsController {
  @Get()
  findAll(): string {
    return 'This action returns all books';
  }
}
