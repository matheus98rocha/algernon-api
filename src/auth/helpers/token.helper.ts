import { JwtService } from '@nestjs/jwt';
import { ITokens } from '../interfaces/auth.type';
import { hashData } from '../utils/hash-data';
import { AuthDto } from '../dto/user.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

export class TokenHelpers {
  constructor(
    @InjectModel('Auth') private authModel: Model<AuthDto>,
    private jwtService: JwtService,
  ) {}

  async getTokens(userId: number, email: string): Promise<ITokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.ACCESSS_TOKEN_SECRET,
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
        },
        {
          secret: process.env.REFRESH_TOKEN_SECRET,
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await hashData(refreshToken);
    try {
      await this.authModel
        .findByIdAndUpdate(userId, {
          hashedRefreshToken: hash,
        })
        .exec();
    } catch (error) {
      return error;
    }
  }
}
