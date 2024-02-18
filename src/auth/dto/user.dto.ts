import { IBook } from 'src/book/interface/book.types';

export interface AuthDto {
  id: string;
  name: string;
  email: string;
  password: string;
  hash: string;
  hashedRefreshToken: string;
}
