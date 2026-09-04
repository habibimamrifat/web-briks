import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { jwtUserPayload } from '../../types/jwtUser.type.js';
import { AUTH_JWT, REFRESH_JWT } from './jwt.constent.js';

@Injectable()
export class AppJwtService {
  constructor(
    @Inject(AUTH_JWT)
    private readonly authJwt: JwtService,

    @Inject(REFRESH_JWT)
    private readonly refreshJwt: JwtService,
  ) {}

  async generateAuthToken(payload: jwtUserPayload): Promise<string> {
    const token = await this.authJwt.signAsync(payload);

    return token;
  }

  async generateRefreshToken(payload: jwtUserPayload): Promise<string> {
    const token = await this.refreshJwt.signAsync(payload);

    return token;
  }

  async verifyAuthToken(token: string): Promise<jwtUserPayload> {
    const isVerified = await this.authJwt.verifyAsync<jwtUserPayload>(token);

    return isVerified;
  }

  async verifyRefreshToken(token: string): Promise<jwtUserPayload> {
    const isVerified = await this.refreshJwt.verifyAsync<jwtUserPayload>(token);

    return isVerified;
  }
}
