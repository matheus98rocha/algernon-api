import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDto } from './dto/user.dto';
import { hashData } from './utils/hash-data';
import { Tokens } from './interfaces/auth.type';

@Injectable()
export class AuthService {
  constructor(@InjectModel('Auth') private authModel: Model<AuthDto>) {}
  async signupLocal(authDto: AuthDto): Promise<Tokens> {
    const hash = await hashData(authDto.password);
    const newUser = this.authModel.create({
      email: authDto.email,
      hash,
    });
    return newUser;
  }
  async signinLocal() {
    return 'This is working';
  }
  async logout() {
    return 'This is working';
  }
  async refresh() {
    return 'This is working';
  }
}
