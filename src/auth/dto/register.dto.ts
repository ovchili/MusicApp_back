import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'User Email in system' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User login in system', minLength: 8 })
  @MinLength(8, {
    message: 'Login cannot be less than 8 characters.',
  })
  @IsString()
  login: string;

  @ApiProperty({ description: 'User Password in system', minLength: 6 })
  @MinLength(6, {
    message: 'Password cannot be less than 6 characters.',
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Path to Avatar User',
    default: '/uploads/default-avatar.png',
  })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatarPath: string;
}
