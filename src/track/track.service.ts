import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { slug } from 'slug-gen';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackDto } from './dto/track.dto';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(searchTerm?: string) {
    const albums = searchTerm
      ? await this.prisma.track.findMany({
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
            Album: true,
            Group: true,
            genres: true,
          },
        })
      : await this.prisma.track.findMany({
          include: {
            Album: true,
            Group: true,
            genres: true,
          },
        });

    return albums;
  }

  async byId(id: string) {
    const album = await this.prisma.track.findUnique({
      where: {
        id,
      },
      include: {
        Album: true,
        Group: true,
        genres: true,
        favoriteUser: true,
      },
    });

    if (!album) throw new NotFoundException('Track not found');

    return album;
  }

  async bySlug(slug: string) {
    const track = await this.prisma.track.findUnique({
      where: {
        slug: slug,
      },
      include: {
        Album: true,
        Group: true,
        genres: true,
      },
    });

    if (!track) throw new NotFoundException('Track not found');

    return track;
  }

  async create(dto: TrackDto) {
    const isSame = await this.prisma.track.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (isSame)
      throw new BadRequestException(
        'Track with the given name already exists ',
      );
    const track = await this.prisma.track.create({
      data: {
        name: dto.name,
        slug: slug(dto.name),
        posterPath: dto.posterPath,
        trackPath: dto.trackPath,
        genres: {},
        Group: {
          connect: {
            id: dto.groupId,
          },
        },
        Album: {
          connect: {
            id: dto.albumId,
          },
        },
      },
      include: {
        Album: true,
        Group: true,
        genres: true,
      },
    });

    dto.genreIds.forEach(async (genreId) => {
      const genre = await this.prisma.genre.findUnique({
        where: {
          id: genreId,
        },
      });

      if (!genre) throw new NotFoundException('Genre not found');

      await this.prisma.track.update({
        where: {
          id: track.id,
        },
        data: {
          genres: {
            connect: {
              id: genreId,
            },
          },
        },
      });
    });

    return track;
  }

  async update(id: string, dto: TrackDto) {
    const track = await this.byId(id);
    const isSame = await this.prisma.track.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (isSame && isSame.id !== track.id)
      throw new BadRequestException(
        'Track with the given name already exists ',
      );

    const newTrack = await this.prisma.track.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        slug: slug(dto.name),
        posterPath: dto.posterPath,
        trackPath: dto.trackPath,
        Group: {
          connect: {
            id: dto.groupId,
          },
        },
        Album: {
          connect: {
            id: dto.albumId,
          },
        },
      },
      include: {
        Album: true,
        Group: true,
        genres: true,
      },
    });

    dto.genreIds.forEach(async (genreId) => {
      const genre = await this.prisma.genre.findUnique({
        where: {
          id: genreId,
        },
      });

      if (!genre) throw new NotFoundException('Genre not found');

      await this.prisma.track.update({
        where: {
          id: newTrack.id,
        },
        data: {
          genres: {
            connect: {
              id: genreId,
            },
          },
        },
      });
    });

    return newTrack;
  }

  async delete(id: string) {
    await this.byId(id);

    return this.prisma.track.delete({
      where: { id },
    });
  }

  async toggleFavorite(userId: string, trackId: string) {
    const track = await this.byId(trackId);

    const isExist = track.favoriteUser.some((user) => user.id === userId);

    await this.prisma.track.update({
      where: {
        id: trackId,
      },
      data: {
        favoriteUser: {
          [isExist ? 'disconnect' : 'connect']: {
            id: userId,
          },
        },
      },
    });

    return `Success ${isExist ? 'disconnect' : 'connect'}`;
  }
}
