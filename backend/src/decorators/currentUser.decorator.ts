import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { jwtUserPayload } from '../types/jwtUser.type.js';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): jwtUserPayload => {
    const request = context.switchToHttp().getRequest<Request>();

    return request.user;
  },
);
