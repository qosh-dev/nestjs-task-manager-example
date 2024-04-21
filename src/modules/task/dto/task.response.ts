import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task.entity';

export class TaskResponse {
  @ApiProperty({
    example: 'b0beabbd-a32b-407d-a9ee-0f6cd2d1a4ab',
    description: 'Task id',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  id?: string;

  @ApiProperty({
    description: 'Task title',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Task description',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Task status',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  status: TaskStatus;

  @ApiProperty({
    example: 'b0beabbd-a32b-407d-a9ee-0f6cd2d1a4ab',
    description: 'Task userId',
    required: false,
  })
  @IsOptional()
  @Expose()
  @IsString()
  userId: string;
}
