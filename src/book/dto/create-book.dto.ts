import { EnumStatusBook } from '../interface/book.types';

export interface CreateBookDto {
  id: string;
  title: string;
  author: string;
  image: string;
  status: EnumStatusBook;
  startedDate?: Date;
  endDate?: Date;
}
