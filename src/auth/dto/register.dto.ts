import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(8, {
    message: 'Login cannot be less than 8 characters.',
  })
  @IsString()
  login: string;

  @MinLength(6, {
    message: 'Password cannot be less than 6 characters.',
  })
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  avatarPath: string;
}
