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

import { Roles } from '../decorators/role.decorator.js';
import { CurrentUser } from '../decorators/currentUser.decorator.js';
import {
  CreateBoardDto,
  InviteBoardMemberDto,
  UpdateBoardDto,
} from './dtos/board.dto.js';
import { BoardsService } from './boards.service.js';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Roles('ALL')
  @Post()
  createBoard(
    @CurrentUser() user: jwtUserPayload,
    @Body() dto: CreateBoardDto,
  ) {
    return this.boardsService.createBoard(user.userId, dto);
  }

  @Roles('ALL')
  @Get()
  getBoards(@CurrentUser() user: jwtUserPayload) {
    return this.boardsService.getBoards(user.userId);
  }

  @Roles('ALL')
  @Get(':id')
  getBoard(@CurrentUser() user: jwtUserPayload, @Param('id') boardId: string) {
    return this.boardsService.getBoard(boardId, user.userId);
  }

  @Roles('ALL')
  @Patch(':id')
  updateBoard(
    @CurrentUser() user: jwtUserPayload,
    @Param('id') boardId: string,
    @Body() dto: UpdateBoardDto,
  ) {
    return this.boardsService.updateBoard(boardId, user.userId, dto);
  }

  @Roles('ALL')
  @Delete(':id')
  deleteBoard(
    @CurrentUser() user: jwtUserPayload,
    @Param('id') boardId: string,
  ) {
    return this.boardsService.deleteBoard(boardId, user.userId);
  }

  @Roles('ALL')
  @Post(':id/invite')
  inviteMember(
    @CurrentUser() user: jwtUserPayload,
    @Param('id') boardId: string,
    @Body() dto: InviteBoardMemberDto,
  ) {
    return this.boardsService.inviteMember(
      boardId,
      user.userId,
      dto.addMemberIds,
      dto.removeMemberIds,
    );
  }
}
