import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RoleModule } from 'src/role/role.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule, RoleModule],
  exports: [UserService],
})
export class UserModule {}
