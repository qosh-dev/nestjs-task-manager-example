import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'Mesmer', description: 'Username' })
  @Expose()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    description: 'User password',
    example: '123123sdadaweqAd#12@',
  })
  @Expose()
  @IsNotEmpty()
  @IsString()
  password: string;
}
