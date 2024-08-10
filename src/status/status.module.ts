import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [StatusController],
  providers: [StatusService],
  imports: [PrismaModule],
  exports: [StatusService],
})
export class StatusModule {}
