import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/user.dto';
import { ITokens } from './interfaces/auth.type';
import { Public } from './common/decorators/public.decorator';
import { GetCurrentUser, GetCurrentUserId } from './common/decorators';
import { RefreshTokenGuard } from './common/gaurds';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('local/signup')
  @HttpCode(HttpStatus.CREATED)
  signupLocal(@Body() authDto: AuthDto): Promise<ITokens> {
    try {
      console.log(authDto);
      return this.authService.signupLocal(authDto);
    } catch (error) {
      console.error(error);
    }
  }

  @Public()
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
  logout(@GetCurrentUserId() userId: string) {
    console.log(userId);
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUser('sub') userId: string,
  ) {
    return this.authService.refresh(userId, refreshToken);
  }
}
