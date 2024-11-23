import { Module } from '@nestjs/common';
import { NotificationGateway } from './gateway';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NotificationGateway],
  exports: [NotificationGateway, PrismaModule],
})
export class GatewayModule {}
