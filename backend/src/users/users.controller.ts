import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto.js';
import { Roles } from '../decorators/role.decorator.js';
import { CurrentUser } from '../decorators/currentUser.decorator.js';
import type { jwtUserPayload } from '../types/jwtUser.type.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('ADMIN')
  @Post()
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  @Roles('ALL')
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }

  @Roles('ALL')
  @Get('me')
  getMe(@CurrentUser() user: jwtUserPayload) {
    return this.usersService.getUserById(user.userId);
  }

  @Roles('ALL')
  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Roles('ALL')
  @Patch('me')
  updateMe(@CurrentUser() user: jwtUserPayload, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(user.userId, dto);
  }

  @Roles('ADMIN')
  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @Roles('ADMIN')
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
