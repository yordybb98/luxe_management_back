import { Module } from '@nestjs/common';
import { OdooService } from './odoo.service';
import { OdooController } from './odoo.controller';
import { TimeService } from 'src/time/time.service';

@Module({
  controllers: [OdooController],
  providers: [OdooService, TimeService],
})
export class OdooModule {}
