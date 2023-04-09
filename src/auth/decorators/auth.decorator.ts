import { UseGuards, applyDecorators } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { OnlyAdminGuard } from '../guards/admin.guard';

type TypeRole = 'user' | 'admin' | undefined;

export const Auth = (role: TypeRole = 'user') =>
  applyDecorators(
    role === 'admin'
      ? UseGuards(JwtAuthGuard, OnlyAdminGuard)
      : UseGuards(JwtAuthGuard),
  );
