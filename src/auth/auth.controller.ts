import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/user.dto';
import { ITokens } from './interfaces/auth.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() authDto: AuthDto): Promise<ITokens> {
    try {
      return this.authService.signupLocal(authDto);
    } catch (error) {
      console.error(error);
    }
  }

  @Post('local/signin')
  @HttpCode(HttpStatus.OK)
  signinLocal(@Body() dto: AuthDto): Promise<ITokens> {
    try {
      return this.authService.signinLocal(dto);
    } catch (error) {
      console.error(error);
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Body() userId: string) {
    return this.authService.logout(userId);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh() {
    return this.authService.refresh();
  }
}
