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
              },
            },
          },
        },
        states: true,
        tasks: true,
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

  async inviteMember(boardId: string, creatorUserId: string, userId: string) {
    const board = await this.prisma.board.findFirst({
      where: {
        id: boardId,
        creatorUserId,
      },
    });

    if (!board) {
      throw new ForbiddenException('Only the board creator can invite members');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
        deletedAt: null,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Creator is already part of the board.
    if (board.creatorUserId === userId) {
      throw new ConflictException(
        'Board creator is already a member of this board',
      );
    }

    const existingMember = await this.prisma.boardMember.findUnique({
      where: {
        boardId_userId: {
          boardId,
          userId,
        },
      },
    });

    if (existingMember) {
      throw new ConflictException('User is already a member of this board');
    }

    return this.prisma.boardMember.create({
      data: {
        boardId,
        userId,
      },

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
    });
  }
}
