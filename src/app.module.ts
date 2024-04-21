import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { TestService } from './helpers/test.service';
import { AppContextModule } from './modules/als/app-context.module';
import { AuthModule } from './modules/auth/auth.module';
import { LoggerModule } from './modules/logger.module';
import { TaskModule } from './modules/task/task.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule,
    AppContextModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    TaskModule,
  ],
  providers: [TestService],
})
export class AppModule {}
