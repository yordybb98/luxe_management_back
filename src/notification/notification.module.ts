import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from 'src/gateway/gateway';

@Module({
  providers: [NotificationService, NotificationGateway],
  exports: [NotificationService, NotificationGateway],
})
export class NotificationModule {}
