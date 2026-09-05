import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto.js';
import { PasswordHasher } from '../helpers/bcrypt/passwordHash.abstract.js';
import { EmailService } from '../mail/mail.service.js';
import { FileUploadService } from '../helpers/fileUpload/file-upload.service.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordHasher: PasswordHasher,
    private readonly emailService: EmailService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  async createUser(dto: CreateUserDto, file?: any) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUser && !existingUser.deletedAt) {
      throw new ConflictException('Email already exists');
    }

    let imageUrl: string | undefined;

    if (file) {
      imageUrl = await this.fileUploadService.uploadFile(file);
    }

    const hashedPassword = await this.passwordHasher.hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        image: imageUrl,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    try {
      await this.emailService.sendEmail(
        user.email,
        'Your Web Briks Account',
        `Hello ${user.name},

        Your Web Briks account has been created successfully.

        Email: ${user.email}
        Password: ${dto.password}

        You can now log in to your account.

        Please change your password after logging in.

        Regards,
        Web Briks`,
      );
    } catch (error) {
      console.error('Failed to send user creation email:', error);
    }

    return user;
  }

  async getUsers() {
    return this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,

        boards: {
          select: {
            id: true,
            name: true,
            description: true,
            creatorUserId: true,
            startDate: true,
            finishDate: true,
            createdAt: true,
            updatedAt: true,
          },
        },

        boardMembers: {
          select: {
            board: {
              select: {
                id: true,
                name: true,
                description: true,
                creatorUserId: true,
                startDate: true,
                finishDate: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const boards = [
      ...user.boards,
      ...user.boardMembers
        .filter(
          (member) =>
            !user.boards.some((board) => board.id === member.board.id),
        )
        .map((member) => member.board),
    ];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      boards,
    };
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    await this.getUserById(id);

    if (dto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: dto.email,
          id: {
            not: id,
          },
          deletedAt: null,
        },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        email: dto.email,
        image: dto.image,
        role: dto.role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(id: string) {
    await this.getUserById(id);

    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      message: 'User deleted successfully',
    };
  }
}
