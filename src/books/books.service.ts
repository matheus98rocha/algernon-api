import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto, statusOptions } from './dto/create-books.dto';
import { UpdateBookDto } from './dto/update-books.dto';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { handleErrors } from '../utils/handleErrors';
import { Pagination } from '../decorators/pagination.decorator';
import { ConfigService } from '@nestjs/config';

import {
  buildWhereClause,
  WhereClauseType,
} from './helpers/where-clause.helper';

@Injectable()
export class BooksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async create(createBookDto: CreateBookDto, userId: number) {
    return await this.prismaService.book.create({
      data: {
        ...createBookDto,
        userId,
      },
    });
  }

  async findAll(
    userId: number,
    { page, limit, offset }: Pagination,
    status?: string,
    bookName?: string,
    isFavorite?: boolean,
  ) {
    try {
      if (
        status &&
        !statusOptions.includes(status as (typeof statusOptions)[number])
      ) {
        throw new Error('Invalid status');
      }

      const whereClause: WhereClauseType = buildWhereClause(
        userId,
        status,
        bookName,
        isFavorite,
      );
      const books = await this.prismaService.book.findMany({
        where: whereClause,
        skip: offset,
        take: limit,
      });

      const totalItems = await this.prismaService.book.count({
        where: whereClause,
      });

      const totalPages = Math.ceil(totalItems / limit);

      return {
        data: books,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
        },
      };
    } catch (error) {
      console.log("error", error)
      handleErrors(error);
    }
  }

  async findOne(id: number, userId: number) {
    return await this.prismaService.book.findUniqueOrThrow({
      where: { id, AND: { userId } },
    });
  }

  async update(id: number, updateBookDto: UpdateBookDto, userId: number) {
    return await this.prismaService.book.update({
      data: {
        ...updateBookDto,
        userId,
      },
      where: { id, AND: { userId } },
    });
  }

  remove(id: number, userId: number) {
    return this.prismaService.book.delete({
      where: { id, AND: { userId } },
    });
  }

  async getBookFromGoogleApi(bookName: string): Promise<any> {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookName)}&key=${this.configService.getOrThrow<string>('GOOGLE_API_KEY')}`;
    const response = await firstValueFrom(this.httpService.get(url));
    const items = response.data.items;

    if (!items || items.length === 0) {
      throw new NotFoundException('No books found');
    } else {
      const formattedItems = items.map((item) => {
        const volumeInfo = item.volumeInfo;
        return {
          title: volumeInfo.title,
          authors: volumeInfo.authors
            ? volumeInfo.authors.join(', ')
            : 'Unknown',
          description: volumeInfo.description,
          bookImage: volumeInfo.imageLinks
            ? volumeInfo.imageLinks.thumbnail
            : 'No image available',
        };
      });

      return formattedItems;
    }
  }
}
