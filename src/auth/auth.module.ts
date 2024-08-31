import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthGuard } from './guards/auth.guard';
import { RoleModule } from 'src/role/role.module';
import { DepartmentModule } from 'src/department/department.module';
import { PermissionGuard } from 'src/common/guards/permission.guard';

@Module({
  imports: [
    RoleModule,
    DepartmentModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: 'APP_GUARD', useClass: AuthGuard },
    { provide: 'APP_GUARD', useClass: PermissionGuard },
  ],
})
export class AuthModule {}
