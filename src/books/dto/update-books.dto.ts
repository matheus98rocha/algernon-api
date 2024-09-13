import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto, StatusOptions } from './create-books.dto';

export class UpdateBookDto extends PartialType(CreateBookDto) {}

export type BookStatusBody = {
  status: StatusOptions;
};
