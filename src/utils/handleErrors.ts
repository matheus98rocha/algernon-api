import { InternalServerErrorException, NotFoundException, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";

export function handleErrors(error: any, message?: string) {

  if(error.status === 401) {
    throw new UnauthorizedException('Email or password incorrect.')
  }

  if (error.status === 500) {
    throw new InternalServerErrorException(`Something went wrong... Try again later`);
  }

  if (error.status === 404) {
    throw new NotFoundException(`Something went wrong... Try again later`);
  }

  if (error.code === 'P2002') {
    throw new UnprocessableEntityException('Email already exists.');
  }

  throw error;
}