import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { ConfigModule } from './config/config.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { BoardsModule } from './boards/boards.module.js';
import { WorkflowStatesModule } from './workflow-states/workflow-states.module.js';
import { TasksModule } from './tasks/tasks.module.js';
import { EmailModule } from './mail/mail.module.js';
import { BcryptModule } from './helpers/bcrypt/bcrypt.module.js';
import { AppService } from './app.service.js';
import { JwtHelperModule } from './helpers/jwt/jwt.module.js';
import { AuthGuard } from './guards/auth.guard.js';
import { FileUploadModule } from './helpers/fileUpload/file-upload.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    BcryptModule,
    AuthModule,
    UsersModule,
    BoardsModule,
    WorkflowStatesModule,
    TasksModule,
    EmailModule,
    JwtHelperModule,
    FileUploadModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
})
export class AppModule {}
