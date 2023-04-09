import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto/user.dto';
import { genSalt, hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        login: true,
        email: true,
        avatarPath: true,
        password: false,
      },
    });

    return users;
  }

  async getUserCount() {
    return await this.prisma.user.count();
  }

  async byId(id: string, selectObject?: Prisma.UserSelect) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        login: true,
        email: true,
        avatarPath: true,
        password: false,
        ...selectObject,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async update(id: string, dto: UserDto) {
    const user = await this.byId(id);

    if (dto.email) {
      const isSame = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (isSame && isSame.id !== user.id)
        throw new BadRequestException('Email is busy');
    }

    if (dto.login) {
      const isSame = await this.prisma.user.findUnique({
        where: {
          login: dto.login,
        },
      });

      if (isSame && isSame.id !== user.id)
        throw new BadRequestException('Login is busy');
    }
    if (dto.password) {
      const salt = await genSalt(10);

      dto.password = await hash(dto.password, salt);
    }

    const newUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: dto,
      select: {
        id: true,
        login: true,
        email: true,
        avatarPath: true,
        password: false,
        isAdmin: true,
      },
    });

    return newUser;
  }

  async delete(id: string) {
    const user = await this.byId(id);

    if (!user) throw new NotFoundException('User not found');

    return await this.prisma.user.delete({
      where: {
        id: id,
      },
    });
  }

  async toggleFavoriteAlbums(id: string, albumId: string) {
    const user = await this.byId(id);

    if (!user) throw new NotFoundException('User not found');

    const isExists = user.FavoriteAlbums.some(
      (album) => album.albumId === albumId,
    );

    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        FavoriteAlbums: {
          [isExists ? 'disconnect' : 'connect']: {
            albumId: albumId,
          },
        },
      },
    });

    return 'Success';
  }
  async toggleFavoriteGroups(id: string, groupId: string) {
    const user = await this.byId(id);

    if (!user) throw new NotFoundException('User not found');

    const isExists = user.FavoriteGroups.some(
      (group) => group.groupId === groupId,
    );

    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        FavoriteGroups: {
          [isExists ? 'disconnect' : 'connect']: {
            groupId: groupId,
          },
        },
      },
    });

    return 'Success';
  }
  async toggleFavoriteTracks(id: string, trackId: string) {
    const user = await this.byId(id);

    if (!user) throw new NotFoundException('User not found');

    const isExists = user.favoriteTracks.some(
      (group) => group.trackId === trackId,
    );

    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        favoriteTracks: {
          [isExists ? 'disconnect' : 'connect']: {
            trackId: trackId,
          },
        },
      },
    });

    return 'Success';
  }
}
