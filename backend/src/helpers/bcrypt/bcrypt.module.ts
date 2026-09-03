import { Global, Module } from '@nestjs/common';
import { PasswordHasher } from './passwordHash.abstract.js';
import { BcryptService } from './bcrypt.service.js';

@Global()
@Module({
  providers: [
    BcryptService,
    {
      provide: PasswordHasher,
      useExisting: BcryptService,
    },
  ],
  exports: [PasswordHasher],
})
export class BcryptModule {}
