import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { Public } from '../decorators/public.decorator.js';
import { CurrentUser } from '../decorators/currentUser.decorator.js';
import type { jwtUserPayload } from '../types/jwtUser.type.js';

import {
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  ResetPasswordDto,
  SetPasswordDto,
} from './dto/auth.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Public()
  @Post('refresh')
  refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('set-password')
  setPassword(
    @CurrentUser() user: jwtUserPayload,
    @Body() body: SetPasswordDto,
  ) {
    return this.authService.setPassword(user.userId, body);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }

  @Get('me')
  getMe(@CurrentUser() user: jwtUserPayload) {
    return this.authService.getMe(user.userId);
  }

  @Post('logout')
  logout(@CurrentUser() user: jwtUserPayload) {
    return this.authService.logout(user.userId);
  }
}
