import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDto } from './dto/user.dto';
import { hashData } from './utils/hash-data';
import { ITokens } from './interfaces/auth.type';
import { TokenHelpers } from './helpers/token.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private authModel: Model<AuthDto>,
    private tokenHelpers: TokenHelpers,
  ) {}

  async signupLocal(authDto: AuthDto): Promise<ITokens> {
    const hash = await hashData(authDto.password);

    const newUser = await this.authModel.create({
      email: authDto.email,
      hash,
    });

    const tokens = await this.tokenHelpers.getTokens(newUser.id, newUser.email);
    await this.tokenHelpers.updateRefreshToken(
      newUser.id,
      tokens.refresh_token,
    );
    return tokens;
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
