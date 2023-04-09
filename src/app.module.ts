import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, AuthModule, UserModule, FileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
