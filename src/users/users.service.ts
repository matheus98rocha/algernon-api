import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { handleErrors } from '../utils/handleErrors';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly userSelect = {
    id: true,
    email: true,
    name: true,
    lastName: true,
    avatar: true,
  };

  async createUser(data: CreateUserDto): Promise<Partial<User>> {
    try {
      const user = await this.prismaService.user.create({
        data: {
          ...data,
          password: await bcrypt.hash(data.password, 10),
        },
        select: this.userSelect,
      });
      return user;
    } catch (error) {
      handleErrors(error);
    }
  }

  async getUsers(): Promise<Partial<User>[]> {
    const users = await this.prismaService.user.findMany({
      select: this.userSelect,
    });
    return users;
  }

  async getUserById(userId: number): Promise<Partial<User>> {
    try {
      const user = await this.prismaService.user.findFirst({
        where: { id: userId },
        select: this.userSelect,
      });
      if (!user) {
        throw new UnprocessableEntityException(
          `Usuário com ID: ${userId} não encontrado`,
        );
      }
      return user;
    } catch (error) {
      handleErrors(error);
    }
  }

  async updateUserById(
    userId: number,
    data: UpdateUserDto,
  ): Promise<Partial<User>> {
    try {
      const user = await this.prismaService.user.update({
        where: { id: userId },
        select: this.userSelect,
        data: {
          ...data,
          password: await bcrypt.hash(data.password, 10),
        },
      });
      if (!user) {
        throw new UnprocessableEntityException(
          `Usuário com ID: ${userId} não encontrado`,
        );
      }
      return user;
    } catch (error) {
      handleErrors(error);
    }
  }

  async updateUserAvatar(
    userId: number,
    avatar: number,
  ): Promise<Partial<User>> {
    try {
      const findUser = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      const user = await this.prismaService.user.update({
        where: { id: userId },
        data: {
          ...findUser,
          avatar: avatar,
        },
      });
      if (!user) {
        throw new UnprocessableEntityException(
          `Usuário com ID: ${userId} não encontrado`,
        );
      }
      return user;
    } catch (error) {
      handleErrors(error);
    }
  }

  async deleteUser(userId: number): Promise<string> {
    try {
      await this.prismaService.user.delete({
        where: { id: userId },
      });
      return `Usuário com ID: ${userId} deletado com sucesso`;
    } catch (error) {
      handleErrors(error);
    }
  }

  async getUserForAuth(filter: Prisma.UserWhereUniqueInput) {
    return await this.prismaService.user.findUnique({
      where: filter,
    });
  }
}
