import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBoardDto, UpdateBoardDto } from './dtos/board.dto.js';

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

  async createBoard(userId: string, dto: CreateBoardDto) {
    return await this.prisma.board.create({
      data: {
        name: dto.name,
        description: dto.description,
        creatorUserId: userId,

        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        finishDate: dto.finishDate ? new Date(dto.finishDate) : undefined,

        members: {
          create: {
            userId,
          },
        },
      },
    });
  }

  async getBoards(userId: string) {
    return await this.prisma.board.findMany({
      where: {
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

      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getBoard(boardId: string, userId: string) {
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

      include: {
        members: {
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

        states: {
          orderBy: {
            position: 'asc',
          },
        },

        tasks: {
          orderBy: {
            priorityIndex: 'asc',
          },

          include: {
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
        },
      },
    });

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return board;
  }

  async updateBoard(boardId: string, userId: string, dto: UpdateBoardDto) {
    const board = await this.prisma.board.findFirst({
      where: {
        id: boardId,
        creatorUserId: userId,
      },
    });

    if (!board) {
      throw new ForbiddenException(
        'Only the board creator can update the board',
      );
    }

    return this.prisma.board.update({
      where: {
        id: boardId,
      },

      data: {
        name: dto.name,
        description: dto.description,

        startDate: dto.startDate ? new Date(dto.startDate) : undefined,

        finishDate: dto.finishDate ? new Date(dto.finishDate) : undefined,
      },
    });
  }

  async deleteBoard(boardId: string, userId: string) {
    const board = await this.prisma.board.findFirst({
      where: {
        id: boardId,
        creatorUserId: userId,
      },
    });

    if (!board) {
      throw new ForbiddenException(
        'Only the board creator can delete the board',
      );
    }

    await this.prisma.board.delete({
      where: {
        id: boardId,
      },
    });

    return {
      message: 'Board deleted successfully',
    };
  }

  async inviteMember(
    boardId: string,
    creatorUserId: string,
    addMemberIds: string[],
    removeMemberIds: string[],
  ) {
    const board = await this.prisma.board.findFirst({
      where: {
        id: boardId,
        creatorUserId,
      },
    });

    if (!board) {
      throw new ForbiddenException('Only the board creator can manage members');
    }

    // Creator cannot be removed or added.
    if (
      addMemberIds.includes(board.creatorUserId) ||
      removeMemberIds.includes(board.creatorUserId)
    ) {
      throw new ConflictException('Board creator cannot be added or removed');
    }

    const allUserIds = [...new Set([...addMemberIds, ...removeMemberIds])];

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: allUserIds,
        },
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (users.length !== allUserIds.length) {
      throw new NotFoundException('One or more users were not found');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      if (removeMemberIds.length > 0) {
        await tx.boardMember.deleteMany({
          where: {
            boardId,
            userId: {
              in: removeMemberIds,
            },
          },
        });
      }

      if (addMemberIds.length > 0) {
        await tx.boardMember.createMany({
          data: addMemberIds.map((userId) => ({
            boardId,
            userId,
          })),
          skipDuplicates: true,
        });
      }

      const members = await tx.boardMember.findMany({
        where: {
          boardId,
        },
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
      });

      return members;
    });

    return result;
  }
}
