import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export type UserRole = 'ADMIN' | 'MEMBER';
export type Role = UserRole | 'ALL';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
