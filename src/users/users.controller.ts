import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Patch, Post, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { parseAndValidateId } from 'src/utils/parseAndValidateId';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwrAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

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
  updateUser(@Param() params: { userID: string }, @Body() request: UpdateUserDto) {
    const userId = parseAndValidateId(params.userID);
    return this.userService.updateUserById(userId, request);
  }

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
