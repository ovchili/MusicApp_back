import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(8, {
    message: 'Login cannot be less than 8 characters.',
  })
  @IsNotEmpty()
  login: string;

  @IsOptional()
  @IsString()
  @MinLength(6, {
    message: 'Password cannot be less than 6 characters.',
  })
  password: string;

  @IsOptional()
  @IsString()
  avatarPath: string;
}
