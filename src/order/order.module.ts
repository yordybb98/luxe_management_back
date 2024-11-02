import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ImageService } from 'src/images/images.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, UserService, JwtService, ImageService],
  imports: [PrismaModule],
})
export class OrderModule {}
