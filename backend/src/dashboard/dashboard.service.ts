import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard() {
    const [
      totalUsers,
      totalBoards,
      totalTasks,
      totalWorkflowStates,
      recentUsers,
      recentBoards,
      recentTasks,
    ] = await Promise.all([
      this.prisma.user.count({
        where: {
          deletedAt: null,
        },
      }),

      this.prisma.board.count(),

      this.prisma.task.count(),

      this.prisma.workflowState.count(),

      this.prisma.user.findMany({
        where: {
          deletedAt: null,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
          createdAt: true,
        },
      }),

      this.prisma.board.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 5,
        select: {
          id: true,
          name: true,
          description: true,
          creatorUserId: true,
          startDate: true,
          finishDate: true,
          createdAt: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),

      this.prisma.task.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
        select: {
          id: true,
          title: true,
          description: true,
          priorityIndex: true,
          startDate: true,
          finishDate: true,
          createdAt: true,

          board: {
            select: {
              id: true,
              name: true,
            },
          },

          workflowState: {
            select: {
              id: true,
              name: true,
              position: true,
            },
          },

          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },

          assignees: {
            select: {
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
      }),
    ]);

    return {
      statistics: {
        totalUsers,
        totalBoards,
        totalTasks,
        totalWorkflowStates,
      },

      recentUsers,

      recentBoards,

      recentTasks,
    };
  }
}
