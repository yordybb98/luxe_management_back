import { Body, Controller, Get, Post } from '@nestjs/common';
import { OdooService } from './odoo.service';
import { Public } from 'src/common/guards/public.guard';

@Public()
@Controller('odoo')
export class OdooController {
  constructor(private readonly odooService: OdooService) {}

  @Get()
  async getVersion() {
    const odooVersion = await this.odooService.getVersion();
    return { odooVersion };
  }
  @Get('authenticate')
  async authenticate() {
    const uid = await this.odooService.authenticate();
    return { uid };
  }

  @Get('employees')
  async getEmployees() {
    const uid = await this.odooService.authenticate();
    const employees = await this.odooService.getEmployees(uid);
    return { employees };
  }

  @Post('attendance')
  async attendance(@Body() data: any) {
    const uid = await this.odooService.authenticate();

    const employee_id = 1;
    const checkIn = '';
    const checkOut = '';

    const result = await this.odooService.createOdooAttendance(
      uid,
      employee_id,
      checkIn,
      checkOut,
    );
    return { result };
  }
}
