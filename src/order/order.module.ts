import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ImageService } from 'src/images/images.service';
import { AuthService } from 'src/auth/auth.service';
import { RoleService } from 'src/role/role.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    UserService,
    JwtService,
    ImageService,
    AuthService,
    RoleService,
  ],
  imports: [PrismaModule, NotificationModule],
})
export class OrderModule {}
