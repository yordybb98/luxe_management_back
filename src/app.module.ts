import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [OrderModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
