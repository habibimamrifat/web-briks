import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { AppJwtService } from '../helpers/jwt/jwt.service.js';
import { LoginDto, ResetPasswordDto, SetPasswordDto } from './dto/auth.dto.js';
import { PasswordHasher } from '../helpers/bcrypt/passwordHash.abstract.js';
import { EmailService } from '../mail/mail.service.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: AppJwtService,
    private readonly emailService: EmailService,
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

      // console.log('========>>>>', payload);

      const userPayload = {
        userId: payload.userId,
        role: payload.role,
      };

      console.log('userPayload:', userPayload);

      const newAccessToken =
        await this.jwtService.generateAuthToken(userPayload);

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
    if (!user || user.deletedAt) {
      return {
        message: 'If the email exists, a reset link will be sent',
      };
    }

    const resetToken = await this.jwtService.generateResetToken({
      userId: user.id,
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    try {
      await this.emailService.sendEmail(
        user.email,
        'Reset Your Web Briks Password',
        `Hello ${user.name},

We received a request to reset your Web Briks password.

Click the link below to reset your password:

${resetLink}

This link will expire in 15 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
Web Briks`,
      );
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }

    return {
      message: 'If the email exists, a reset link will be sent',
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const payload = await this.jwtService.verifyResetToken(dto.token);

      const user = await this.prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
      });

      if (!user || user.deletedAt) {
        throw new UnauthorizedException('Invalid or expired reset token');
      }

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

  // logout(userId: string) {
  //   // Token invalidation will be implemented if we store refresh tokens.
  //   return {
  //     message: 'Logged out successfully',
  //   };
  // }
}
