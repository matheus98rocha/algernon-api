import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/user.dto';
import { ITokens } from './interfaces/auth.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/local/signup')
  signupLocal(@Body() authDto: AuthDto): Promise<ITokens> {
    try {
      return this.authService.signupLocal(authDto);
    } catch (error) {
      return error;
    }
  }

  @Post('/local/signin')
  signinLocal() {
    return this.authService.signinLocal();
  }

  @Post('/logout')
  logout() {
    return this.authService.logout();
  }

  @Post('/refresh')
  refresh() {
    return this.authService.refresh();
  }
}
