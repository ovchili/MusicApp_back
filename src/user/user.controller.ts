import {
  Post,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  UsePipes,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from './decorators/user.decorator';
import { Prisma } from '@prisma/client';
import { UserDto } from './dto/user.dto';
//import { UserDto } from './dto/user.dto';

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

  @Get('/profile/favorites')
  @Auth()
  async getFavorites(
    @CurrentUser('id') id: string,
    favorites: Prisma.UserSelect = {
      id: false,
      login: false,
      email: false,
      avatarPath: false,
      favoriteTracks: true,
      FavoriteAlbums: true,
      FavoriteGroups: true,
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

  @Patch('profile/favorites/:trackId')
  @Auth()
  @HttpCode(200)
  async toggleFavoriteTracks(
    @CurrentUser('id') id: string,
    @Param('trackId') trackId: string,
  ) {
    return await this.userService.toggleFavoriteTracks(id, trackId);
  }

  @Patch('profile/favorites/:groupId')
  @Auth()
  @HttpCode(200)
  async toggleFavoriteGroups(
    @CurrentUser('id') id: string,
    @Param('groupId') groupId: string,
  ) {
    return await this.userService.toggleFavoriteGroups(id, groupId);
  }

  @Patch('profile/favorites/:albumId')
  @Auth()
  @HttpCode(200)
  async toggleFavoriteAlbums(
    @CurrentUser('id') id: string,
    @Param('albumId') albumId: string,
  ) {
    return await this.userService.toggleFavoriteAlbums(id, albumId);
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
