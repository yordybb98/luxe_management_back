import { Module } from '@nestjs/common';
import { OdooService } from './odoo.service';
import { OdooController } from './odoo.controller';
import { OrderModule } from 'src/order/order.module';

@Module({
  controllers: [OdooController],
  providers: [OdooService],
  //imports: [OrderModule],
})
export class OdooModule {}
