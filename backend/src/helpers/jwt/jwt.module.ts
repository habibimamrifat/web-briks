import { Global, Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { AppJwtService } from './jwt.service.js';
import { AUTH_JWT, REFRESH_JWT } from './jwt.constent.js';


@Global()
@Module({
  providers: [
    {
      provide: AUTH_JWT,
      useFactory: () =>
        new JwtService({
          secret: process.env.JWT_AUTH_SECRET,
          signOptions: {
            audience: process.env.JWT_AUTH_AUDIENCE,
            issuer: process.env.JWT_AUTH_ISSUER,
            expiresIn: (process.env.JWT_AUTH_EXPIRES_IN ??
              '15m') as StringValue,
          },
        }),
    },
    {
      provide: REFRESH_JWT,
      useFactory: () =>
        new JwtService({
          secret: process.env.JWT_REFRESH_SECRET,
          signOptions: {
            audience: process.env.JWT_REFRESH_AUDIENCE,
            issuer: process.env.JWT_REFRESH_ISSUER,
            expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ??
              '365d') as StringValue,
          },
        }),
    },
    AppJwtService,
  ],
  exports: [AppJwtService],
})
export class JwtHelperModule {}
