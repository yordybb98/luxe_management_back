import { Injectable } from '@nestjs/common';
import { TimeService } from 'src/time/time.service';

const xmlrpc = require('xmlrpc');

@Injectable()
export class OdooService {
  url = 'https://luxe-graphics.odoo.com';
  db = process.env.ODOO_DB;
  username = process.env.ODOO_USERNAME;
  password = process.env.ODOO_PASSWORD;

  commonClient = xmlrpc.createClient({
    url: `${this.url}/xmlrpc/2/common`,
  });

  modelsClient = xmlrpc.createClient({
    url: `${this.url}/xmlrpc/2/object`,
  });

  constructor(private readonly timeService: TimeService) {}

  getVersion = () => {
    return new Promise((resolve, reject) => {
      this.commonClient.methodCall('version', [], (err: any, version: any) => {
        if (err) {
          reject(err); // Rechaza la promesa si hay un error
        } else {
          resolve(version); // Resuelve la promesa con la versión
        }
      });
    });
  };

  authenticate = async (): Promise<number> => {
    // Autenticarse
    return new Promise((resolve, reject) => {
      this.commonClient.methodCall(
        'authenticate',
        [this.db, this.username, this.password, {}],
        (err: any, uid: any) => {
          if (err) {
            console.error('Error al autenticar:', err);
            reject(err); // Rechaza la promesa si hay un error
          } else {
            resolve(uid);
          }
        },
      );
    });
  };

  createOdooAttendance = async (
    uid: number,
    employeeId: number,
    checkIn: string,
    checkOut: string,
  ): Promise<any> => {
    try {
      const checkInUTC = await this.timeService.odooUTC(checkIn);
      const checkOutUTC = await this.timeService.odooUTC(checkOut);
      const record = await new Promise((resolve, reject) => {
        this.modelsClient.methodCall(
          'execute_kw', // Odoo method name
          [
            this.db, // Database name
            uid, // User session ID
            this.password, // Password
            'hr.attendance', // Model name for attendance
            'create', // Method to create a new record
            [
              {
                employee_id: employeeId, // Employee ID
                check_in: checkInUTC, // Check-in time (string in format: 'YYYY-MM-DD HH:MM:SS')
                check_out: checkOutUTC, // Check-out time (string in format: 'YYYY-MM-DD HH:MM:SS')
              },
            ],
          ],
          (err: any, record: any) => {
            if (err) {
              reject(err); // Reject if there's an error
            } else {
              resolve(record); // Resolve with the created attendance record
            }
          },
        );
      });

      return record; // Return the created attendance record
    } catch (err) {
      console.error('Error creating Odoo attendance:', err);
    }
    return {}; // Return empty object in case of error
  };

  createOdooAttendanceBatch = async (
    uid: number,
    records: any[],
  ): Promise<any> => {
    try {
      if (records.length === 0) return { message: 'No records to insert' };

      console.log(`Inserting ${records.length} attendance records...`);

      // Bulk insert using `execute_kw`
      const createdRecords = await new Promise((resolve, reject) => {
        this.modelsClient.methodCall(
          'execute_kw',
          [
            this.db,
            uid,
            this.password,
            'hr.attendance',
            'create',
            [records], // Batch insertion in a single request
          ],
          (err: any, result: any) => {
            if (err) reject(err);
            else resolve(result);
          },
        );
      });

      return createdRecords;
    } catch (err) {
      console.error('Error creating batch Odoo attendance:', err);
      return { error: err };
    }
  };

  getEmployees = async (uid: number): Promise<any[]> => {
    try {
      const records = await new Promise((resolve, reject) => {
        this.modelsClient.methodCall(
          'execute_kw',
          [
            this.db,
            uid,
            this.password,
            'hr.employee',
            'search_read',
            [],
            { fields: ['id', 'resource_id', 'display_name'] },
          ],
          (err: any, records: any[]) => {
            if (err) {
              reject(err);
            } else {
              resolve(records);
            }
          },
        );
      });
      return records as any[];
    } catch (err) {
      console.error('Error getting Odoo employees:', err);
      return [];
    }
  };

  getEmployeeIdsByNames = async (
    uid: number,
    employeeNames: string[],
  ): Promise<Record<string, number>> => {
    try {
      // Fetch employee records by name
      const employees = await new Promise<any[]>((resolve, reject) => {
        this.modelsClient.methodCall(
          'execute_kw',
          [
            this.db,
            uid,
            this.password,
            'hr.employee',
            'search_read',
            [[['name', 'in', employeeNames]]], // Search employees by name
            { fields: ['id', 'name'] }, // Fetch only ID and name
          ],
          (err: any, result: any) => {
            if (err) reject(err);
            else resolve(result);
          },
        );
      });

      // Map employee names to IDs
      const employeeMap: Record<string, number> = {};
      employees.forEach((emp) => {
        employeeMap[emp.name] = emp.id;
      });

      return employeeMap;
    } catch (err) {
      console.error('Error fetching employee IDs:', err);
      return {};
    }
  };
}
