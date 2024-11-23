import { Module } from '@nestjs/common';
import { NotificationGateway } from './gateway';

@Module({
  providers: [NotificationGateway],
  exports: [NotificationGateway],
})
export class GatewayModule {}
