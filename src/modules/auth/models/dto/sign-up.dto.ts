import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class SignUpDto {
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
  @IsStrongPassword({ minLength: 8 })
  password: string;
}
