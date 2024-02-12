import { EnumStatusBook } from '../interface/book.types';

export interface UpdateBookDto {
  image: string;
  status: EnumStatusBook;
  startedDate?: Date;
  endDate?: Date;
}
