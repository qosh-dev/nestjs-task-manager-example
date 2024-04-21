import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOneTaskPayload } from './dto/create-one.dto';
import { UpdateOnePayload } from './dto/update-one.dto';
import { TaskCommon } from './task.common';
import { TaskEntity } from './task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity) private repo: Repository<TaskEntity>,
  ) {}

  async create(payload: CreateOneTaskPayload) {
    try {
      const queryBuilder = this.repo.createQueryBuilder('task');
      const newTask = await queryBuilder
        .insert()
        .into('task')
        .values({
          title: payload.title,
          description: payload.description,
          userId: payload.userId,
        })
        .execute();

      const createdTaskId = newTask.identifiers[0].id;
      const createdTask = await this.repo.findOneBy({ id: createdTaskId });
      return createdTask;
    } catch (e) {
      throw new HttpException(TaskCommon.DUPLICATE_RECORD, HttpStatus.CONFLICT);
    }
  }

  async findOne(id: string) {
    return this.repo.findOneBy({ id });
  }

  async findMany() {
    return this.repo.find({});
  }

  async updateOne(payload: UpdateOnePayload) {
    const { id, userId, ...updateProps } = payload;

    if (!Object.keys(updateProps).length) {
      return false;
    }

    const record = await this.repo.manager
      .createQueryBuilder()
      .update(TaskEntity)
      .set(updateProps)
      .where('id = :id', { id })
      .andWhere('userId = :userId', { userId })
      .execute();

    if (record.affected === 0) {
      throw new HttpException(TaskCommon.NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return true;
  }

  async deleteOne(taskId: string, userId: string) {
    try {
      const deleteResult = await this.repo.manager
        .createQueryBuilder()
        .delete()
        .from(TaskEntity)
        .where('id = :id', { id: taskId })
        .andWhere('userId = :userId', { userId })
        .execute();

      if (deleteResult.affected === 0) {
        return false;
      }

      return true;
    } catch (e) {
      return false;
    }
  }
}
