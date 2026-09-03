import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import type { jwtUserPayload } from '../types/jwtUser.type.js';
import { CreateTaskDto, MoveTaskDto, UpdateTaskDto } from './dto/task.dto.js';
import { TasksService } from './task.service.js';
import { Roles } from '../decorators/role.decorator.js';
import { CurrentUser } from '../decorators/currentUser.decorator.js';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Roles('ALL')
  @Post()
  create(@CurrentUser() user: jwtUserPayload, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(user.userId, dto);
  }

  @Roles('ALL')
  @Get('board/:boardId')
  findAll(
    @CurrentUser() user: jwtUserPayload,
    @Param('boardId') boardId: string,
  ) {
    return this.tasksService.findAll(boardId, user.userId);
  }

  @Roles('ALL')
  @Get(':id')
  findOne(@CurrentUser() user: jwtUserPayload, @Param('id') id: string) {
    return this.tasksService.findOne(id, user.userId);
  }

  @Roles('ALL')
  @Patch(':id')
  update(
    @CurrentUser() user: jwtUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, user.userId, dto);
  }

  @Roles('ALL')
  @Patch(':id/move')
  move(
    @CurrentUser() user: jwtUserPayload,
    @Param('id') id: string,
    @Body() dto: MoveTaskDto,
  ) {
    return this.tasksService.move(id, user.userId, dto);
  }

  @Roles('ALL')
  @Delete(':id')
  remove(@CurrentUser() user: jwtUserPayload, @Param('id') id: string) {
    return this.tasksService.remove(id, user.userId);
  }
}
