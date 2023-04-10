import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { slug } from 'slug-gen';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupDto } from './dto/group.dto';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(searchTerm?: string) {
    console.log(searchTerm);
    const groups = searchTerm
      ? await this.prisma.group.findMany({
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
            albums: true,
          },
        })
      : await this.prisma.group.findMany({
          include: {
            tracks: true,
            albums: true,
          },
        });

    return groups;
  }

  async byId(id: string) {
    const group = await this.prisma.group.findUnique({
      where: {
        id,
      },
      include: {
        tracks: true,
        albums: true,
        favoriteUsers: true,
      },
    });

    if (!group) throw new NotFoundException('Group not found');

    return group;
  }

  async bySlug(slug: string) {
    const group = await this.prisma.group.findUnique({
      where: {
        slug: slug,
      },
      include: {
        tracks: true,
        albums: true,
      },
    });

    if (!group) throw new NotFoundException('Group not found');

    return group;
  }

  async create(dto: GroupDto) {
    const isSame = await this.prisma.group.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (isSame)
      throw new BadRequestException(
        'Group with the given name already exists ',
      );
    const group = await this.prisma.group.create({
      data: {
        name: dto.name,
        slug: slug(dto.name),
        posterPath: dto.posterPath,
      },
    });

    return group;
  }

  async update(id: string, dto: GroupDto) {
    const group = await this.byId(id);
    const isSame = await this.prisma.group.findUnique({
      where: {
        name: dto.name,
      },
    });

    if (isSame && isSame.id !== group.id)
      throw new BadRequestException(
        'Group with the given name already exists ',
      );

    const newGroup = await this.prisma.group.update({
      where: {
        id,
      },
      data: {
        name: dto.name,
        slug: slug(dto.name),
        posterPath: dto.posterPath,
      },
    });

    return newGroup;
  }

  async delete(id: string) {
    await this.byId(id);

    return this.prisma.group.delete({
      where: { id },
    });
  }

  async toggleFavorite(userId: string, groupId: string) {
    const group = await this.byId(groupId);

    const isExist = group.favoriteUsers.some((user) => user.id === userId);

    console.log(isExist);

    await this.prisma.group.update({
      where: {
        id: groupId,
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
