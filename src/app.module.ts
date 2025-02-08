import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { CommonModule } from './common/common.module';
import { ImageModule } from './images/image.module';
import { GatewayModule } from './gateway/gateway.module';
import { NotificationModule } from './notification/notification.module';
import { ScheduleModule } from '@nestjs/schedule';
import { OdooModule } from './odoo/odoo.module';
import { TimeService } from './time/time.service';
import { TimeModule } from './time/time.module';
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
    ScheduleModule.forRoot(),
    OdooModule,
    TimeModule,
  ],
  controllers: [],
  providers: [TimeService],
})
export class AppModule {}
