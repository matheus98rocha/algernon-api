import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export const statusOptions = [
  'wantToRead',
  'alreadyRead',
  'reading',
  'abandoned',
  'rereading',
] as const;
export type StatusOptions = (typeof statusOptions)[number];

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  book: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(statusOptions, {
    message: `Status must be one of the following values: ${statusOptions.join(', ')}`,
  })
  status: StatusOptions;

  @IsBoolean()
  @IsOptional()
  isFavorite: boolean;

  @IsString()
  imageUrl: string;
}
