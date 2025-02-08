import { Controller, Get } from '@nestjs/common';
import { OdooService } from './odoo.service';
import { Public } from 'src/common/guards/public.guard';

@Controller('odoo')
export class OdooController {
  constructor(private readonly odooService: OdooService) {}

  @Public()
  @Get()
  async getVersion() {
    const odooVersion = await this.odooService.getVersion();
    return { odooVersion };
  }
}
