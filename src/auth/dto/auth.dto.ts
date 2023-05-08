import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty({ description: 'Email or username to login in system' })
  @IsString()
  loginOrEmail: string;

  @MinLength(6, {
    message: 'Password cannot be less than 6 characters.',
  })
  @ApiProperty({ description: 'Password to login in system', minLength: 6 })
  @IsString()
  password: string;
}
