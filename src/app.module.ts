import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { CommonModule } from './common/common.module';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
