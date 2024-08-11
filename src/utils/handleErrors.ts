import {
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

export function handleErrors(error: any, message?: string) {
  if (error.status === 401) {
    throw new UnauthorizedException('E-mail ou senha incorretos.');
  }

  if (error.status === 500) {
    throw new InternalServerErrorException(
      'Algo deu errado... Tente novamente mais tarde.',
    );
  }

  if (error.status === 404 || error.code === 'P2025') {
    throw new NotFoundException(message || 'Registro não encontrado.');
  }

  if (error.status === 404) {
    throw new NotFoundException(
      'Algo deu errado... Tente novamente mais tarde.',
    );
  }

  if (error.code === 'P2002') {
    throw new UnprocessableEntityException('E-mail já existe.');
  }

  throw error;
}
