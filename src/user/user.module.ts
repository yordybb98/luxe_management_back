import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleModule } from 'src/role/role.module';
import { DepartmentModule } from 'src/department/department.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, RoleModule, DepartmentModule],
  exports: [UserService],
})
export class UserModule {}
