import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { Prisma } from '@prisma/client';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/profile')
  @Auth()
  async getProfile(
    @CurrentUser('id') id: string,
    selectObject?: Prisma.UserSelect,
  ) {
    return await this.userService.byId(id, selectObject);
  }

  @Get('/favorites')
  @Auth()
  async getFavorites(
    @CurrentUser('id') id: string,
    favorites: Prisma.UserSelect = {
      id: false,
      login: false,
      email: false,
      avatarPath: false,
      favoriteTracks: true,
      favoriteAlbums: true,
      favoriteGroups: true,
    },
  ) {
    return await this.userService.byId(id, favorites);
  }

  @UsePipes(new ValidationPipe())
  @Put('/profile')
  @Auth()
  @HttpCode(200)
  async updateProfile(@CurrentUser('id') id: string, @Body() dto: UserDto) {
    return await this.userService.update(id, dto);
  }

  @Get('/count')
  @Auth('admin')
  async getUserCount() {
    return await this.userService.getUserCount();
  }

  @Get('')
  @Auth('admin')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @UsePipes(new ValidationPipe())
  @Put('/:id')
  @Auth('admin')
  @HttpCode(200)
  async updateUser(@Param('id') id: string, @Body() dto: UserDto) {
    return this.userService.update(id, dto);
  }

  @Delete('/:id')
  @Auth('admin')
  @HttpCode(200)
  async Delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
