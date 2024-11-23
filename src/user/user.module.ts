import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleModule } from 'src/role/role.module';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, RoleModule, NotificationModule],
  exports: [UserService],
})
export class UserModule {}
