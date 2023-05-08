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
import { GroupService } from './group.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GroupDto } from './dto/group.dto';
import { CurrentUser } from 'src/user/decorators/user.decorator';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  @Auth()
  async getAllGroups(@Query('search') searchTerm?: string) {
    return await this.groupService.getAll(searchTerm);
  }

  @Get('slug/:slug')
  @Auth()
  async getGroupBySlug(@Param('slug') slug: string) {
    return await this.groupService.bySlug(slug);
  }

  @Get(':id')
  @Auth('admin')
  async getGroupById(@Param('id') id: string) {
    return await this.groupService.byId(id);
  }

  @Post()
  @Auth('admin')
  @HttpCode(200)
  async createGroup(@Body() dto: GroupDto) {
    return await this.groupService.create(dto);
  }

  @Put(':id')
  @Auth('admin')
  @HttpCode(200)
  async updateGroup(@Param('id') id: string, @Body() dto: GroupDto) {
    return await this.groupService.update(id, dto);
  }

  @Patch(':id/favorites')
  @Auth()
  @HttpCode(200)
  async toggleFavorite(
    @CurrentUser('id') userId: string,
    @Param('id') groupId: string,
  ) {
    return await this.groupService.toggleFavorite(userId, groupId);
  }

  @Delete(':id')
  @Auth('admin')
  @HttpCode(200)
  async deleteGroup(@Param('id') id: string) {
    return await this.groupService.delete(id);
  }
}
