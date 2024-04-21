import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { TaskController } from './task.controller';
import { TaskEntity } from './task.entity';
import { TaskService } from './task.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TaskEntity])],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
