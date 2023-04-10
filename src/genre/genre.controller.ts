import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreDto } from './dto/genre.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Get()
  @Auth()
  async getAllGenres(@Query('search') searchTerm?: string) {
    return await this.genreService.getAll(searchTerm);
  }

  @Get('slug/:slug')
  @Auth()
  async getGenreBySlug(@Param('slug') slug: string) {
    return await this.genreService.bySlug(slug);
  }

  @Get(':id')
  @Auth('admin')
  async getGenreById(@Param('id') id: string) {
    return await this.genreService.byId(id);
  }

  @Post()
  @Auth('admin')
  @HttpCode(200)
  async createGenre(@Body() dto: GenreDto) {
    return await this.genreService.create(dto);
  }

  @Put(':id')
  @Auth('admin')
  @HttpCode(200)
  async updateGenre(@Param('id') id: string, @Body() dto: GenreDto) {
    return await this.genreService.update(id, dto);
  }

  @Delete(':id')
  @Auth('admin')
  @HttpCode(200)
  async deleteGenre(@Param('id') id: string) {
    return await this.genreService.delete(id);
  }
}
