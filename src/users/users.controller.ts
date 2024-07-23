import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { parseAndValidateId } from '../utils/parseAndValidateId';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwrAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { TokenPayload } from '../auth/interfaces/token-payload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  createUser(@Body() request: CreateUserDto) {
    return this.userService.createUser(request);
  }

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get('by-id/:userID')
  getUserById(@Param() params: { userID: string }) {
    const userId = parseAndValidateId(params.userID);
    return this.userService.getUserById(userId);
  }

  @Patch('by-id/:userID')
  updateUser(
    @Param() params: { userID: string },
    @Body() request: UpdateUserDto,
  ) {
    const userId = parseAndValidateId(params.userID);
    return this.userService.updateUserById(userId, request);
  }

  // TODO: Error quando tem apenas um usuário cadastrado
  @Delete('by-id/:userID')
  deleteUser(@Param() params: { userID: string }) {
    const userId = parseAndValidateId(params.userID);
    return this.userService.deleteUser(userId);
  }

  @Get('me')
  @UseGuards(JwrAuthGuard)
  getCurrentUser(@CurrentUser() user: TokenPayload) {
    return user;
  }
}
