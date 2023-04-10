import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { slug } from 'slug-gen';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlbumDto } from './dto/album.dto';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(searchTerm?: string) {
    const albums = searchTerm
      ? await this.prisma.album.findMany({
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
            Group: true,
          },
        })
      : await this.prisma.album.findMany({
          include: {
            tracks: true,
            Group: true,
          },
        });

    return albums;
  }

  async byId(id: string) {
    const album = await this.prisma.album.findUnique({
      where: {
        id,
      },
      include: {
        tracks: true,
        Group: true,
        favoriteUsers: true,
      },
    });

    if (!album) throw new NotFoundException('Album not found');

    return album;
  }

  async bySlug(slug: string) {
    const album = await this.prisma.album.findUnique({
      where: {
        slug: slug,
      },
      include: {
        tracks: true,
        Group: true,
      },
    });

    if (!album) throw new NotFoundException('Album not found');

    return album;
  }

  async create(dto: AlbumDto) {
    const isSame = await this.prisma.album.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (isSame)
      throw new BadRequestException(
        'Album with the given name already exists ',
      );
    const album = await this.prisma.album.create({
      data: {
        name: dto.name,
        slug: slug(dto.name),
        posterPath: dto.posterPath,
        Group: {
          connect: {
            id: dto.groupId,
          },
        },
      },
    });

    return album;
  }

  async update(id: string, dto: AlbumDto) {
    const album = await this.byId(id);
    const isSame = await this.prisma.album.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (isSame && isSame.id !== album.id)
      throw new BadRequestException(
        'Album with the given name already exists ',
      );

    const newAlbum = await this.prisma.album.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        slug: slug(dto.name),
        posterPath: dto.posterPath,
        Group: {
          connect: {
            id: dto.groupId,
          },
        },
      },
    });

    return newAlbum;
  }

  async delete(id: string) {
    await this.byId(id);

    return this.prisma.album.delete({
      where: { id },
    });
  }

  async toggleFavorite(userId: string, albumId: string) {
    const album = await this.byId(albumId);

    const isExist = album.favoriteUsers.some((user) => user.id === userId);

    await this.prisma.album.update({
      where: {
        id: albumId,
      },
      data: {
        favoriteUsers: {
          [isExist ? 'disconnect' : 'connect']: {
            id: userId,
          },
        },
      },
    });

    return `Success ${isExist ? 'disconnect' : 'connect'}`;
  }
}
