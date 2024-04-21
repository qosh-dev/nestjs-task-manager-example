import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOneTaskDto {
  @ApiProperty({
    description: 'Task title',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @ApiProperty({
    description: 'Task description',
    required: true,
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  readonly description: string;
}

export class CreateOneTaskPayload extends CreateOneTaskDto {
  userId: string;
}
