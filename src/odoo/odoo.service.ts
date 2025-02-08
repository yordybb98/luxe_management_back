import { Injectable } from '@nestjs/common';

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
}
