import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-books.dto';
import { UpdateBookDto } from './dto/update-books.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BooksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) {}
  async create(createBookDto: CreateBookDto, userId: number) {
    return await this.prismaService.book.create({
      data: {
        ...createBookDto,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return await this.prismaService.book.findMany({
      where: { userId },
    });
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
    return this.prismaService.book.deleteMany();
  }

  async getBookFromGoogleApi(bookName: string): Promise<any> {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookName)}`;
    const response = await firstValueFrom(this.httpService.get(url));
    const items = response.data.items;
    if (items && items.length === 0) {
      throw new NotFoundException('No books found');
    } else {
      const volumeInfo = items[0].volumeInfo;
      return {
        title: volumeInfo.title,
        authors: volumeInfo.authors ? volumeInfo.authors[0] : 'Unknown',
        description: volumeInfo.description,
        bookImage: volumeInfo.imageLinks
          ? volumeInfo.imageLinks.thumbnail
          : 'No image available',
      };
    }
  }
}
