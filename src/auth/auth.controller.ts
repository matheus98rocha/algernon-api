import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/user.dto';
import { ITokens } from './interfaces/auth.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('local/signup')
  signupLocal(@Body() authDto: AuthDto): Promise<ITokens> {
    try {
      return this.authService.signupLocal(authDto);
    } catch (error) {
      console.error(error);
    }
  }

  @Post('local/signin')
  signinLocal(@Body() dto: AuthDto): Promise<ITokens> {
    try {
      return this.authService.signinLocal(dto);
    } catch (error) {
      console.error(error);
    }
  }

  @Post('logout')
  logout() {
    return this.authService.logout();
  }

  @Post('refresh')
  refresh() {
    return this.authService.refresh();
  }
}
