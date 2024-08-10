import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserService } from 'src/user/user.service';
import { StatusModule } from 'src/status/status.module';

@Module({
  controllers: [OrderController],
  providers: [OrderService, UserService],
  imports: [PrismaModule, StatusModule],
})
export class OrderModule {}
