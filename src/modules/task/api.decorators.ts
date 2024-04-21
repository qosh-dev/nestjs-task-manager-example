import {
  applyDecorators,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { ApiResponseCode, ApiResponseModel } from '../../helpers/api.helper';
import { Authorized } from '../auth/decorator/authorized.decorator';
import { CreateOneTaskDto } from './dto/create-one.dto';
import { TaskResponse } from './dto/task.response';
import { UpdateOneTaskDto } from './dto/update-one.dto';
import { TaskCommon } from './task.common';

export const ApiPostCreateOneTask = () =>
  applyDecorators(
    ApiResponseModel(HttpStatus.OK, 'Will return new task', TaskResponse),
    ApiResponseCode(HttpStatus.BAD_REQUEST, TaskCommon.INVALID_PAYLOAD),
    ApiResponseCode(HttpStatus.CONFLICT, TaskCommon.DUPLICATE_RECORD),
    ApiBody({ type: CreateOneTaskDto, required: true }),
    Authorized(),
    Post('/'),
  );

export const ApiGetOneTask = () =>
  applyDecorators(
    ApiResponseModel(HttpStatus.OK, 'Will return task', TaskResponse),
    ApiResponseCode(HttpStatus.NOT_FOUND, TaskCommon.NOT_FOUND),
    Get('/:id'),
  );

export const ApiGetManyTask = () =>
  applyDecorators(
    ApiResponseModel(HttpStatus.OK, 'Will return many tasks', [TaskResponse]),
    Get('/'),
  );

export const ApiPatchTask = () =>
  applyDecorators(
    ApiResponseModel(HttpStatus.OK, 'Will return task update status', Boolean),
    ApiResponseCode(HttpStatus.NOT_FOUND, TaskCommon.NOT_FOUND),
    ApiConsumes('application/json'),
    ApiBody({ type: UpdateOneTaskDto, required: true }),
    Authorized(),
    Patch('/:id'),
  );

export const ApiDeleteOneTask = () =>
  applyDecorators(
    ApiResponseModel(HttpStatus.OK, 'Will return task delete status', Boolean),
    ApiConsumes('application/json'),
    Authorized(),
    Delete('/:id'),
  );
