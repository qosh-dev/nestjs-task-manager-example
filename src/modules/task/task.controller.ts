import {
  Body,
  Controller,
  NotFoundException,
  Param,
  ParseUUIDPipe
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { CurrentUserModel } from '../auth/models/current-user.model';
import {
  ApiDeleteOneTask,
  ApiGetManyTask,
  ApiGetOneTask,
  ApiPatchTask,
  ApiPostCreateOneTask,
} from './api.decorators';
import { CreateOneTaskDto } from './dto/create-one.dto';
import { UpdateOneTaskDto } from './dto/update-one.dto';
import { TaskCommon } from './task.common';
import { TaskService } from './task.service';

@ApiTags('Tasks')
@Controller('/tasks')
export class TaskController {
  constructor(private service: TaskService) {}

  @ApiPostCreateOneTask()
  async createTask(
    @Body() body: CreateOneTaskDto,
    @CurrentUser() currentUser: CurrentUserModel,
  ) {
    return this.service.create({
      ...body,
      userId: currentUser.id,
    });
  }

  @ApiGetOneTask()
  async findOneTask(@Param('id', ParseUUIDPipe) id: string) {
    const record = await this.service.findOne(id);
    if (!record) {
      throw new NotFoundException(TaskCommon.NOT_FOUND);
    }
    return record;
  }

  @ApiGetManyTask()
  async findManyTasks() {
    return this.service.findMany();
  }

  @ApiPatchTask()
  async updateOneTask(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateOneTaskDto,
    @CurrentUser() currentUser: CurrentUserModel,
  ) {
    return this.service.updateOne({
      ...body,
      id,
      userId: currentUser.id,
    });
  }

  @ApiDeleteOneTask()
  async deleteOneTask(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: CurrentUserModel,
  ) {
    return this.service.deleteOne(id, currentUser.id);
  }
}
