import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from 'src/gateway/gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { NotificationController } from './notification.controller';

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationGateway,
    PrismaService,
    UserService,
  ],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
