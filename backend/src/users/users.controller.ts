import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service.js';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto.js';
import { Roles } from '../decorators/role.decorator.js';
import { CurrentUser } from '../decorators/currentUser.decorator.js';
import type { jwtUserPayload } from '../types/jwtUser.type.js';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles('ADMIN')
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createUser(
    @CurrentUser() user: jwtUserPayload,
    @Body() dto: CreateUserDto,
    @UploadedFile() file?: any,
  ) {
    console.log('FILE RECEIVED:', file);

    return this.usersService.createUser(dto, file);
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
  @UseInterceptors(FileInterceptor('image'))
  updateMe(
    @CurrentUser() user: jwtUserPayload,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file?: any,
  ) {
    return this.usersService.updateMe(user.userId, dto, file);
  }

  @Roles('ADMIN')
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  updateUser(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile() file?: any,
  ) {
    return this.usersService.updateUser(id, dto, file);
  }

  @Roles('ADMIN')
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
