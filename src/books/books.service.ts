import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-books.dto';
import { UpdateBookDto } from './dto/update-books.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BooksService {
  constructor(private readonly prismaService: PrismaService) {}
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
}
