import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { ProjectModule } from './project/project.module';
import { ClientModule } from './client/client.module';
import { DepartmentModule } from './department/department.module';
@Module({
  imports: [OrderModule, UserModule, AuthModule, RoleModule, PermissionModule, ProjectModule, ClientModule, DepartmentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
