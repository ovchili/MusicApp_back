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
import { TrackService } from './track.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { TrackDto } from './dto/track.dto';

@Controller('tracks')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  @Auth()
  async getAllTracks(@Query('search') searchTerm?: string) {
    return await this.trackService.getAll(searchTerm);
  }

  @Get('slug/:slug')
  @Auth()
  async getTrackBySlug(@Param('slug') slug: string) {
    return await this.trackService.bySlug(slug);
  }

  @Get(':id')
  @Auth('admin')
  async getTrackById(@Param('id') id: string) {
    return await this.trackService.byId(id);
  }

  @Post()
  @Auth('admin')
  @HttpCode(200)
  async createTrack(@Body() dto: TrackDto) {
    return await this.trackService.create(dto);
  }

  @Put(':id')
  @Auth('admin')
  @HttpCode(200)
  async updateTrack(@Param('id') id: string, @Body() dto: TrackDto) {
    return await this.trackService.update(id, dto);
  }

  @Patch(':id/favorites')
  @Auth()
  @HttpCode(200)
  async toggleFavorite(
    @CurrentUser('id') userId: string,
    @Param('id') groupId: string,
  ) {
    return await this.trackService.toggleFavorite(userId, groupId);
  }

  @Delete(':id')
  @Auth('admin')
  @HttpCode(200)
  async deleteGenre(@Param('id') id: string) {
    return await this.trackService.delete(id);
  }
}
