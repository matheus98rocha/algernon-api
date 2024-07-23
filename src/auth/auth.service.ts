import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt'
import { User } from '@prisma/client';
import { Response } from 'express';
import ms from 'ms'
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { handleErrors } from '../utils/handleErrors';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly jwtSerice: JwtService) { }

  async login(user: User, response: Response) {
    const expires = new Date();

    expires.setMilliseconds(
      expires.setMilliseconds(
        expires.getMilliseconds() + ms(this.configService.getOrThrow<string>('JWT_EXPIRATION')),
      )
    )

    const tokenPayload: TokenPayload = {
      userId: user.id
    }

    const token = this.jwtSerice.sign(tokenPayload);

    response.cookie('Authentication', token, {
      secure: true,
      httpOnly: true,
      expires
    })

    return { tokenPayload }
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.userService.getUserForAuth({ email })

      if(!user){
        throw new UnauthorizedException()
      }

      const authUser = await bcrypt.compare(password, user.password)
      if (!authUser) {
        throw new UnauthorizedException()
      }
      return user;
    } catch (error) {
      handleErrors(error)
    }
  }
}
