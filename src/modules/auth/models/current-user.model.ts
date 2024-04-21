import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { UserEntity } from '../../user/user.entity';

@Exclude()
export class CurrentUserModel extends UserEntity {
  @Expose()
  @IsNumber()
  id: string;

  @ApiProperty({
    description: 'Username',
    example: 'Mesmer',
  })
  @Expose()
  @IsString()
  username: string;
}
