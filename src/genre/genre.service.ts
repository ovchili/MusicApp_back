import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GenreDto } from './dto/genre.dto';
import { slug } from 'slug-gen';

@Injectable()
export class GenreService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(searchTerm?: string) {
    const genres = searchTerm
      ? await this.prisma.genre.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: searchTerm,
                },
              },
              {
                slug: {
                  contains: searchTerm,
                },
              },
            ],
          },
          include: {
            tracks: true,
          },
        })
      : await this.prisma.genre.findMany({
          include: {
            tracks: true,
          },
        });

    return genres;
  }
  async byId(id: string) {
    const genre = await this.prisma.genre.findUnique({
      where: {
        id,
      },
      include: {
        tracks: true,
      },
    });

    if (!genre) throw new NotFoundException('Genre not found');

    return genre;
  }

  async bySlug(slug: string) {
    const genre = await this.prisma.genre.findUnique({
      where: {
        slug,
      },
      include: {
        tracks: true,
      },
    });

    if (!genre) throw new NotFoundException('Genre not found');
    return genre;
  }

  async create(dto: GenreDto) {
    const isSame = await this.prisma.genre.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (isSame)
      throw new BadRequestException(
        'Genre with the given name already exists ',
      );
    const genre = await this.prisma.genre.create({
      data: {
        name: dto.name,
        slug: slug(dto.name),
      },
    });

    return genre;
  }

  async update(id: string, dto: GenreDto) {
    const genre = await this.byId(id);
    const isSame = await this.prisma.genre.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (isSame && isSame.id !== genre.id)
      throw new BadRequestException(
        'Genre with the given name already exists ',
      );

    const newGenre = await this.prisma.genre.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        slug: slug(dto.name),
      },
    });

    return newGenre;
  }

  async delete(id: string) {
    await this.byId(id);

    return this.prisma.genre.delete({
      where: { id },
    });
  }
}
