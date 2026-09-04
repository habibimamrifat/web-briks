import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto, MoveTaskDto, UpdateTaskDto } from './dto/task.dto.js';

@Injectable()
export class TasksService {
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

  async create(userId: string, dto: CreateTaskDto) {
    await this.checkBoardAccess(dto.boardId, userId);

    const workflowState = await this.prisma.workflowState.findFirst({
      where: {
        id: dto.workflowStateId,
        boardId: dto.boardId,
      },
    });

    if (!workflowState) {
      throw new NotFoundException(
        'Workflow state does not belong to this board',
      );
    }

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        userId,
        boardId: dto.boardId,
        workflowStateId: dto.workflowStateId,

        priorityIndex: dto.priorityIndex ?? 0,

        startDate: dto.startDate ? new Date(dto.startDate) : undefined,

        finishDate: dto.finishDate ? new Date(dto.finishDate) : undefined,
      },
    });
  }

  async findAll(boardId: string, userId: string) {
    await this.checkBoardAccess(boardId, userId);

    return this.prisma.task.findMany({
      where: {
        boardId,
      },
      orderBy: {
        priorityIndex: 'asc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        board: {
          OR: [
            {
              creatorUserId: userId,
            },
            {
              members: {
                some: {
                  userId,
                },
              },
            },
          ],
        },
      },

      include: {
        workflowState: {
          select: {
            id: true,
            name: true,
          },
        },

        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, userId: string, dto: UpdateTaskDto) {
    const task = await this.findOne(id, userId);

    const updatedTask = await this.prisma.$transaction(async (tx) => {
      // Update normal task fields
      const updatedTask = await tx.task.update({
        where: {
          id: task.id,
        },

        data: {
          title: dto.title,
          description: dto.description,

          workflowStateId: dto.workflowStateId,

          priorityIndex: dto.priorityIndex,

          startDate: dto.startDate ? new Date(dto.startDate) : undefined,

          finishDate: dto.finishDate ? new Date(dto.finishDate) : undefined,
        },
      });

      // Toggle assigned members
      if (dto.assigneeIds) {
        for (const memberId of dto.assigneeIds) {
          const existingAssignment = await tx.taskAssignee.findUnique({
            where: {
              taskId_userId: {
                taskId: task.id,
                userId: memberId,
              },
            },
          });

          if (existingAssignment) {
            await tx.taskAssignee.delete({
              where: {
                id: existingAssignment.id,
              },
            });
          } else {
            await tx.taskAssignee.create({
              data: {
                taskId: task.id,
                userId: memberId,
              },
            });
          }
        }
      }

      return updatedTask;
    });

    return updatedTask;
  }

  async move(id: string, userId: string, dto: MoveTaskDto) {
    const task = await this.findOne(id, userId);

    // The workflow state MUST belong to the same board.
    const workflowState = await this.prisma.workflowState.findFirst({
      where: {
        id: dto.workflowStateId,
        boardId: task.boardId,
      },
    });

    if (!workflowState) {
      throw new ForbiddenException('Task cannot be moved to another board');
    }

    return this.prisma.task.update({
      where: {
        id: task.id,
      },
      data: {
        workflowStateId: dto.workflowStateId,
        priorityIndex: dto.priorityIndex,
      },
    });
  }

  async remove(id: string, userId: string) {
    const task = await this.findOne(id, userId);

    await this.prisma.task.delete({
      where: {
        id: task.id,
      },
    });

    return {
      message: 'Task deleted successfully',
    };
  }
}
