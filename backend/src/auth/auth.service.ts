import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AppJwtService } from '../helpers/jwt/jwt.service.js';
import { LoginDto, ResetPasswordDto, SetPasswordDto } from './dto/auth.dto.js';
import { PasswordHasher } from '../helpers/bcrypt/passwordHash.abstract.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: AppJwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await this.passwordHasher.comparePassword(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.generateAuthToken(payload);
    const refreshToken = await this.jwtService.generateRefreshToken(payload);

    return {
      user: payload,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyRefreshToken(refreshToken);

      const newAccessToken = await this.jwtService.generateAuthToken(payload);

      return {
        accessToken: newAccessToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async setPassword(userId: string, dto: SetPasswordDto) {
    const hashedPassword = await this.passwordHasher.hashPassword(dto.password);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return {
      message: 'Password updated successfully',
    };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    // Don't reveal whether the email exists.
    if (!user) {
      return {
        message: 'If the email exists, a reset link will be sent',
      };
    }

    // Password reset token/email logic will go here.
    // We will implement this with MailService.

    return {
      message: 'If the email exists, a reset link will be sent',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const payload = await this.jwtService.verifyAuthToken(dto.token);

      const hashedPassword = await this.passwordHasher.hashPassword(
        dto.password,
      );

      await this.prisma.user.update({
        where: {
          id: payload.userId,
        },
        data: {
          password: hashedPassword,
        },
      });

      return {
        message: 'Password reset successfully',
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }

  async getMe(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
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

  async logout(userId: string) {
    // Token invalidation will be implemented if we store refresh tokens.
    return {
      message: 'Logged out successfully',
    };
  }
}
