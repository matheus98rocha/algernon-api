import { IsEmail, IsString } from 'class-validator';
import { IsCustomStrongPassword } from '../decorators/custom-strong-password';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsCustomStrongPassword()
  password: string;

  @IsString({ message: 'Nome é obrigatório' })
  name: string;

  @IsString({ message: 'Sobrenome é obrigatório' })
  lastName: string;
}
