import { Body, Controller, Get, Post } from '@nestjs/common';
import { OdooService } from './odoo.service';
import { Public } from 'src/common/guards/public.guard';
import { Attendance } from 'src/common/types/attendance';
import { TimeService } from 'src/time/time.service';

@Public()
@Controller('odoo')
export class OdooController {
  constructor(
    private readonly odooService: OdooService,
    private readonly timeService: TimeService,
  ) {}

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
  async attendance(@Body() data: Attendance[]) {
    const uid = await this.odooService.authenticate();

    if (!data || data.length === 0) {
      return { message: 'No attendance entries provided.' };
    }

    // Extract unique employee names from the request
    const employeeNames = [...new Set(data.map((entry) => entry.user))];

    // Get employee IDs from Odoo
    const employeeMap = await this.odooService.getEmployeeIdsByNames(
      uid,
      employeeNames,
    );

    // Transform entries to include employee_id
    const batchRecords = await Promise.all(
      data.map(async (entry) => {
        const employeeId = employeeMap[entry.user]; // Get employee ID from map
        if (!employeeId) {
          console.warn(`Employee not found: ${entry.user}`);
          return null;
        }

        return {
          employee_id: employeeId,
          check_in: await this.timeService.odooUTC(entry.in),
          ...(entry.out !== 'N/A' && {
            check_out: await this.timeService.odooUTC(entry.out),
          }),
        };
      }),
    );

    // Remove null values (entries with missing employee IDs)
    const validRecords = batchRecords.filter((record) => record !== null);

    if (validRecords.length === 0) {
      return { message: 'No valid attendance records found.' };
    }

    // Insert attendance records in bulk
    const result = await this.odooService.createOdooAttendanceBatch(
      uid,
      validRecords,
    );
    return { success: true, result };
  }
}
