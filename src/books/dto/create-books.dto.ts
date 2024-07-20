import { IsNotEmpty, IsString } from "class-validator";

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  book: string;
  
  @IsString()
  @IsNotEmpty()
  description: string
  
  @IsString()
  @IsNotEmpty()
  author: string
}
