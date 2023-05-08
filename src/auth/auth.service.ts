import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { compare, genSalt, hash } from 'bcryptjs';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const oldEmail = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    const oldLogin = await this.prisma.user.findUnique({
      where: {
        login: dto.login,
      },
    });

    if (oldEmail)
      throw new BadRequestException('User with this email already exists');
    if (oldLogin)
      throw new BadRequestException('User with this login already exists');

    const salt = await genSalt(10);
    const user = await this.prisma.user.create({
      data: {
        login: dto.login,
        email: dto.email,
        password: await hash(dto.password, salt),
        avatarPath: dto.avatarPath,
      },
    });

    const tokens = await this.issueTokenPair(user.id);

    return { user: this.returnUserFields(user), ...tokens };
  }

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);

    const tokens = await this.issueTokenPair(user.id);

    return { user: this.returnUserFields(user), ...tokens };
  }

  async refreshTokens(dto: RefreshDto) {
    const { refreshToken } = dto;

    if (!refreshToken) throw new UnauthorizedException('Please sign in!');

    const result = await this.jwtService.verifyAsync(refreshToken);

    if (!result) throw new UnauthorizedException('Invalid token or expired');

    const user = await this.prisma.user.findUnique({
      where: {
        id: result.id,
      },
    });

    const tokens = await this.issueTokenPair(user.id);

    return { user: this.returnUserFields(user), ...tokens };
  }

  private async validateUser(dto: AuthDto) {
    const user =
      (await this.prisma.user.findUnique({
        where: {
          email: dto.loginOrEmail,
        },
      })) ||
      (await this.prisma.user.findUnique({
        where: {
          login: dto.loginOrEmail,
        },
      }));

    if (!user) throw new UnauthorizedException('User not found');
    const isValidPassword = await compare(dto.password, user.password);
    if (!isValidPassword) throw new UnauthorizedException('Invalid password');

    return user;
  }

  private async issueTokenPair(userId: string) {
    const data = { id: userId };
    const refreshToken = await this.jwtService.signAsync(data, {
      expiresIn: '7d',
    });

    const accessToken = await this.jwtService.signAsync(data, {
      expiresIn: '1h',
    });
    return { accessToken, refreshToken };
  }

  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
      login: user.login,
      avatarPath: user.avatarPath,
      isAdmin: user.isAdmin,
    };
  }
}
