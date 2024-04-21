import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task.entity';

export class UpdateOneTaskDto {
  @ApiProperty({
    description: 'Task title',
  })
  @IsOptional()
  @Expose()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Task description',
  })
  @IsOptional()
  @Expose()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Task status',
  })
  @IsOptional()
  @Expose()
  @IsString()
  status?: TaskStatus;
}

export class UpdateOnePayload extends UpdateOneTaskDto {
  id: string;
  userId: string;
}
