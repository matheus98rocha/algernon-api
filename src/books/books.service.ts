import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto, statusOptions } from './dto/create-books.dto';
import { BookStatusBody, UpdateBookDto } from './dto/update-books.dto';
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
import { GoogleBooksApiResponse } from '../types/google-books-api';
import { buildOrderClause, orderByOptions } from './helpers/order-by.helper';

@Injectable()
export class BooksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async create(createBookDto: CreateBookDto, userId: number) {
    try {
      const book = await this.prismaService.book.findFirst({
        where: {
          book: createBookDto.book,
          userId,
        },
      });
      if (book !== null) {
        throw new ConflictException('Você já cadastrou esse livro.');
      }

      const dataObj = {
        ...createBookDto,
        userId,
        rate: Number(createBookDto.rate),
      };

      if (createBookDto.status !== 'alreadyRead') {
        delete dataObj.rate;
      }

      return await this.prismaService.book.create({
        data: dataObj,
      });
    } catch (error) {
      handleErrors(error);
    }
  }

  async findAll(
    userId: number,
    { page, limit, offset }: Pagination,
    status?: string,
    bookName?: string,
    isFavorite?: boolean,
    orderBy?: orderByOptions,
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

      const orderClause = buildOrderClause(orderBy);

      const books = await this.prismaService.book.findMany({
        where: whereClause,
        skip: offset,
        take: limit,
        orderBy: orderClause,
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
      handleErrors(error);
    }
  }

  async findOne(id: number, userId: number) {
    try {
      return await this.prismaService.book.findUniqueOrThrow({
        where: { id, AND: { userId } },
      });
    } catch (error) {
      handleErrors(error, 'Livro não encontrado');
    }
  }

  async update(id: number, updateBookDto: UpdateBookDto, userId: number) {
    try {
      return await this.prismaService.book.update({
        data: {
          ...updateBookDto,
          userId,
        },
        where: { id, AND: { userId } },
      });
    } catch (error) {
      handleErrors(error, 'Livro não encontrado para atualização');
    }
  }

  async updateStatusBook(
    id: number,
    statusBody: BookStatusBody,
    userId: number,
  ) {
    try {
      const { status } = statusBody;
      return await this.prismaService.book.update({
        data: {
          status: status,
          userId,
        },
        where: { id, AND: { userId } },
      });
    } catch (error) {
      handleErrors(error, 'Livro não encontrado para atualização');
    }
  }

  async remove(id: number, userId: number) {
    try {
      const deletedBook = await this.prismaService.book.delete({
        where: { id, AND: { userId } },
      });
      return deletedBook;
    } catch (error) {
      handleErrors(error, 'Livro não encontrado para exclusão');
    }
  }

  async getBookFromGoogleApi(
    bookName: string,
  ): Promise<GoogleBooksApiResponse[]> {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookName)}&key=${this.configService.getOrThrow<string>('GOOGLE_API_KEY')}&lang=pt-BR`;
    const response = await firstValueFrom(this.httpService.get(url));
    const items = response.data.items;

    if (!items || items.length === 0) {
      throw new NotFoundException('No books found');
    } else {
      const formattedItems = items.map((item) => {
        const volumeInfo = item.volumeInfo;
        const imageLinks = volumeInfo.imageLinks;
        const bookImage =
          imageLinks?.smallThumbnail ||
          imageLinks?.thumbnail ||
          'No image available';

        return {
          title: volumeInfo.title,
          authors: volumeInfo.authors
            ? volumeInfo.authors.join(', ')
            : 'Unknown',
          description: volumeInfo.description,
          bookImage: bookImage,
        };
      });

      return formattedItems;
    }
  }
}
