import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { AuthDto } from './dto/auth.dto';
import { RefreshDto } from './dto/refresh.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  @HttpCode(200)
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: AuthDto) {
    return await this.authService.login(dto);
  }

  @UsePipes(new ValidationPipe())
  @Post('login/access')
  @HttpCode(200)
  async refreshTokens(@Body() dto: RefreshDto) {
    return await this.authService.refreshTokens(dto);
  }
}
