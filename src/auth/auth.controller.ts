import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/user.dto';
import { AuthenticationRequest, ITokens } from './interfaces/auth.type';
import { AuthGuard } from '@nestjs/passport';

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

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: AuthenticationRequest) {
    const user = req.user.sub;
    return this.authService.logout(user);
  }

  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@Req() req: AuthenticationRequest) {
    const { sub, refreshToken } = req.user;

    return this.authService.refresh(sub, refreshToken);
  }
}
