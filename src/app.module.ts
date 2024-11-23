import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { CommonModule } from './common/common.module';
import { ImageModule } from './images/image.module';
import { GatewayModule } from './gateway/gateway.module';
import { NotificationModule } from './notification/notification.module';
@Module({
  imports: [
    OrderModule,
    UserModule,
    AuthModule,
    RoleModule,
    CommonModule /* 
    ProjectModule,
    ClientModule,
    DepartmentModule,
    StatusModule, */,
    ImageModule,
    GatewayModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
