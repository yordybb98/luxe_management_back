import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { OrderModule } from 'src/order/order.module';

@Module({
  providers: [CommonService],
  controllers: [CommonController],
  imports: [OrderModule],
})
export class CommonModule {}
