import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { OrderModule } from 'src/order/order.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [OrderModule, AuthModule],
})
export class TaskModule {}
