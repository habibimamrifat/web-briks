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
    return this.authJwt.signAsync(payload);
  }

  async generateRefreshToken(payload: jwtUserPayload): Promise<string> {
    return this.refreshJwt.signAsync(payload);
  }

  async verifyAuthToken(token: string): Promise<jwtUserPayload> {
    return this.authJwt.verifyAsync<jwtUserPayload>(token);
  }

  async verifyRefreshToken(token: string): Promise<jwtUserPayload> {
    return this.refreshJwt.verifyAsync<jwtUserPayload>(token);
  }
}
