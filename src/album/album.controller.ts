import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AlbumDto } from './dto/album.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';

@Controller('albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @Auth()
  async getAllAlbums(@Query('search') searchTerm?: string) {
    return await this.albumService.getAll(searchTerm);
  }

  @Get('slug/:slug')
  @Auth()
  async getAlbumBySlug(@Param('slug') slug: string) {
    return await this.albumService.bySlug(slug);
  }

  @Get(':id')
  @Auth('admin')
  async getAlbumById(@Param('id') id: string) {
    return await this.albumService.byId(id);
  }

  @Post()
  @Auth('admin')
  @HttpCode(200)
  async createAlbum(@Body() dto: AlbumDto) {
    return await this.albumService.create(dto);
  }

  @Put(':id')
  @Auth('admin')
  @HttpCode(200)
  async updateAlbum(@Param('id') id: string, @Body() dto: AlbumDto) {
    return await this.albumService.update(id, dto);
  }

  @Patch(':id/favorites')
  @Auth()
  @HttpCode(200)
  async toggleFavorite(
    @CurrentUser('id') userId: string,
    @Param('id') groupId: string,
  ) {
    return await this.albumService.toggleFavorite(userId, groupId);
  }

  @Delete(':id')
  @Auth('admin')
  @HttpCode(200)
  async deleteAlbum(@Param('id') id: string) {
    return await this.albumService.delete(id);
  }
}
