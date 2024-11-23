import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from 'src/gateway/gateway';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [NotificationService, NotificationGateway, PrismaService],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
