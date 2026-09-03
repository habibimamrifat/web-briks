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
import {
  CreateWorkflowStateDto,
  UpdateWorkflowStateDto,
} from './dto/workflow-state.dto.js';
import { WorkflowStatesService } from './workflow-state.service.js';
import { Roles } from '../decorators/role.decorator.js';
import { CurrentUser } from '../decorators/currentUser.decorator.js';

@Controller('workflow-states')
export class WorkflowStatesController {
  constructor(private readonly workflowStatesService: WorkflowStatesService) {}

  @Roles('ALL')
  @Post('board/:boardId')
  create(
    @CurrentUser() user: jwtUserPayload,
    @Param('boardId') boardId: string,
    @Body() dto: CreateWorkflowStateDto,
  ) {
    return this.workflowStatesService.create(boardId, user.userId, dto);
  }

  @Roles('ALL')
  @Get('board/:boardId')
  findAll(
    @CurrentUser() user: jwtUserPayload,
    @Param('boardId') boardId: string,
  ) {
    return this.workflowStatesService.findAll(boardId, user.userId);
  }

  @Roles('ALL')
  @Get(':id')
  findOne(@CurrentUser() user: jwtUserPayload, @Param('id') id: string) {
    return this.workflowStatesService.findOne(id, user.userId);
  }

  @Roles('ALL')
  @Patch(':id')
  update(
    @CurrentUser() user: jwtUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateWorkflowStateDto,
  ) {
    return this.workflowStatesService.update(id, user.userId, dto);
  }

  @Roles('ALL')
  @Delete(':id')
  remove(@CurrentUser() user: jwtUserPayload, @Param('id') id: string) {
    return this.workflowStatesService.remove(id, user.userId);
  }
}
