import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
@Module({
  imports: [OrderModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
