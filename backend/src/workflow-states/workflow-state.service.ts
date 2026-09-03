import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreateWorkflowStateDto,
  UpdateWorkflowStateDto,
} from './dto/workflow-state.dto.js';

@Injectable()
export class WorkflowStatesService {
  constructor(private readonly prisma: PrismaService) {}

  private async checkBoardAccess(boardId: string, userId: string) {
    const board = await this.prisma.board.findFirst({
      where: {
        id: boardId,
        OR: [
          { creatorUserId: userId },
          {
            members: {
              some: {
                userId,
              },
            },
          },
        ],
      },
    });

    if (!board) {
      throw new ForbiddenException('You do not have access to this board');
    }

    return board;
  }

  async create(boardId: string, userId: string, dto: CreateWorkflowStateDto) {
    await this.checkBoardAccess(boardId, userId);

    return this.prisma.workflowState.create({
      data: {
        name: dto.name,
        boardId,
        userId,

        position: dto.position ?? 0,

        startDate: dto.startDate ? new Date(dto.startDate) : undefined,

        finishDate: dto.finishDate ? new Date(dto.finishDate) : undefined,
      },
    });
  }

  async findAll(boardId: string, userId: string) {
    await this.checkBoardAccess(boardId, userId);

    return this.prisma.workflowState.findMany({
      where: {
        boardId,
      },
      orderBy: {
        position: 'asc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const state = await this.prisma.workflowState.findUnique({
      where: {
        id,
      },
    });

    if (!state) {
      throw new NotFoundException('Workflow state not found');
    }

    await this.checkBoardAccess(state.boardId, userId);

    return state;
  }

  async update(id: string, userId: string, dto: UpdateWorkflowStateDto) {
    const state = await this.findOne(id, userId);

    return this.prisma.workflowState.update({
      where: {
        id: state.id,
      },
      data: {
        name: dto.name,

        position: dto.position,

        startDate: dto.startDate ? new Date(dto.startDate) : undefined,

        finishDate: dto.finishDate ? new Date(dto.finishDate) : undefined,
      },
    });
  }

  async remove(id: string, userId: string) {
    const state = await this.findOne(id, userId);

    await this.prisma.workflowState.delete({
      where: {
        id: state.id,
      },
    });

    return {
      message: 'Workflow state deleted successfully',
    };
  }
}
