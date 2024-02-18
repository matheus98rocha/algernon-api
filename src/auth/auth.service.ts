import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthDto } from './dto/user.dto';
import { hashData } from './utils/hash-data';
import { ITokens } from './interfaces/auth.type';
import { TokenHelpers } from './helpers/token.helper';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private authModel: Model<AuthDto>,
    private tokenHelpers: TokenHelpers,
  ) {}

  async signupLocal(authDto: AuthDto): Promise<ITokens> {
    const { password, email, name } = authDto;
    const hash = await hashData(password);

    const newUser = await this.authModel.create({ email, hash, name });
    const { id, email: userEmail } = newUser;

    const tokens = await this.tokenHelpers.getTokens(id, userEmail);
    await this.tokenHelpers.updateRefreshToken(id, tokens.refresh_token);
    return tokens;
  }

  async signinLocal(dto: AuthDto): Promise<ITokens> {
    const currentUser = await this.authModel.findOne({ email: dto.email });

    if (
      !currentUser ||
      !(await bcrypt.compare(dto.password, currentUser.hash))
    ) {
      throw new ForbiddenException('Invalid credentials');
    }

    const tokens = await this.tokenHelpers.getTokens(
      currentUser.id,
      currentUser.email,
    );
    await this.tokenHelpers.updateRefreshToken(
      currentUser.id,
      tokens.refresh_token,
    );
    return tokens;
  }
  async logout(userId: string) {
    try {
      await this.authModel.findOneAndUpdate(
        { _id: userId },
        { hashedRefreshToken: null },
        { new: true }, // Adicione essa opção se desejar retornar o documento atualizado
      );
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  }

  async refresh(userId: string, refreshToken: string) {
    const user = await this.authModel.findOne({ _id: userId });

    if (!user) throw new ForbiddenException('Acess denied');

    const refeshTokenMatch = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );
    if (!refeshTokenMatch) throw new ForbiddenException('Acess denied');

    const tokens = await this.tokenHelpers.getTokens(user.id, user.email);
    await this.tokenHelpers.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }
}
