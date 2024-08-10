import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService],
  imports: [PrismaModule],
  exports: [DepartmentService],
})
export class DepartmentModule {}
