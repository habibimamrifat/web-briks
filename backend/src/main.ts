import { NestFactory } from '@nestjs/core';

import { AuthGuard } from './guards/auth.guard.js';
import { AppModule } from './app.module.js';
import { seed } from '../prisma/seed.js';
import { setupSwagger } from './helpers/swagger/swagger.js';
import { AppValidationPipe } from './pipe/validation.pipe.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  app.useGlobalGuards(app.get(AuthGuard));
  app.useGlobalPipes(AppValidationPipe);
  setupSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
  await seed();

  console.log(
    'app is running on port ',
    process.env.PORT,
    ' in ',
    process.env.ENVIRONMENT,
    ' environment',
    'api documentation is available at localhost:' +
      (process.env.PORT ?? 3000) +
      '/api/v1',
  );
}
bootstrap();
