const xmlrpc = require('xmlrpc');
const fs = require('fs');

const yordabb = {
  url: 'https://yordanbb.odoo.com',
  db: 'yordanbb',
  username: 'yordanbb98@gmail.com',
  password: '12345678',
};

// Configura tus credenciales aquí
const url = 'https://luxe-graphics.odoo.com';
const db = process.env.ODOO_DB;
const username = process.env.ODOO_USERNAME;
const password = process.env.ODOO_PASSWORD;

// Crear un cliente para el servicio 'common' de Odoo
const commonClient = xmlrpc.createClient({
  url: `${url}/xmlrpc/2/common`,
});

// Crear un cliente para el servicio 'object' de Odoo
const modelsClient = xmlrpc.createClient({
  url: `${url}/xmlrpc/2/object`,
});

const getOdooVersion = () => {
  return new Promise((resolve, reject) => {
    commonClient.methodCall('version', [], (err: any, version: any) => {
      if (err) {
        reject(err); // Rechaza la promesa si hay un error
      } else {
        resolve(version); // Resuelve la promesa con la versión
      }
    });
  });
};

const authenticateFromOdoo = async (): Promise<number> => {
  // Autenticarse
  return new Promise((resolve, reject) => {
    commonClient.methodCall(
      'authenticate',
      [db, username, password, {}],
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

// Verificar los derechos de acceso en el modelo 'res.partner'
// modelsClient.methodCall(
//   'execute_kw',
//   [
//     db,
//     uid,
//     password,
//     'hr.employee',
//     'check_access_rights',
//     ['read'],
//     { raise_exception: false },
//   ],
//   (err, result) => {
//     if (err) {
//       console.error('Error al verificar los derechos de acceso:', err);
//       return;
//     }

//     console.log('Derechos de acceso:', result);
//   },
// );

// modelsClient.methodCall(
//   'execute_kw',
//   [
//     db,
//     uid,
//     password,
//     'res.partner',
//     'fields_get',
//     [],
//     { attributes: ['string', 'help', 'type'] },
//   ],
//   (err, fields) => {
//     if (err) {
//       console.error('Error al obtener los campos:', err);
//       return;
//     }

//     console.log('Campos del modelo res.partner:', fields);
//   },
// );

// Crear un nuevo registro en el modelo 'res.partner'
// const newPartner = {
//   name: 'New Partner',
// };

// modelsClient.methodCall(
//   'execute_kw',
//   [db, uid, password, 'res.partner', 'create', [newPartner]],
//   (err, id) => {
//     if (err) {
//       console.error('Error al crear el registro:', err);
//       return;
//     }

//     console.log('ID del nuevo registro:', id);
//   },
// );

// Obtener los modelos disponibles
// modelsClient.methodCall(
//   'execute_kw',
//   [db, uid, password, 'ir.model', 'search_read', [[], ['model']]],
//   (err, models) => {
//     if (err) {
//       console.error('Error al obtener los modelos:', err);
//       return;
//     }

//     console.log('Modelos disponibles:', models);
//   },
// );

// Buscar todos los IDs de empleados
// modelsClient.methodCall(
//   'execute_kw',
//   [db, uid, password, 'hr.employee', 'search', [[], ]],
//   (err, ids) => {
//     if (err) {
//       console.error('Error al buscar los IDs de empleados:', err);
//       return;
//     }

//     console.log('IDs de empleados encontrados:', ids);

//     // Leer todos los empleados
//     // modelsClient.methodCall(
//     //   'execute_kw',
//     //   [
//     //     db,
//     //     uid,
//     //     password,
//     //     'hr.employee',
//     //     'read',
//     //     [ids],
//     //     { fields: ['name', 'work_email', 'job_id', 'department_id'] },
//     //   ],
//     //   (err, employees) => {
//     //     if (err) {
//     //       console.error('Error al leer los empleados:', err);
//     //       return;
//     //     }

//     //     console.log('Empleados:', employees);
//     //   },
//     // );
//   },
// );

// Obtener información de los campos del modelo 'res.employee'
// modelsClient.methodCall(
//   'execute_kw',
//   [
//     db,
//     uid,
//     password,
//     'hr.employee',
//     'fields_get',
//     [],
//     { attributes: ['string', 'help', 'type'] },
//   ],
//   (err, fields) => {
//     if (err) {
//       console.error('Error al obtener la información de los campos:', err);
//       return;
//     }

//     console.log('Campos del modelo hr.employee:', fields);
//   },
// );

// Buscar todos los registros en 'res.partner' sin filtros
/* const getOdooEmployees = async (uid: number): Promise<Client[]> => {
  try {
    // Buscar todos los registros en 'hr.employee'
    const ids = await new Promise((resolve, reject) => {
      modelsClient.methodCall(
        'execute_kw',
        [db, uid, password, 'hr.employee', 'search', [[]]],
        (err: any, ids: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(ids);
          }
        },
      );
    });

    console.log('IDs founded:', ids);

    // Leer detalles de los registros
    const records = await new Promise((resolve, reject) => {
      modelsClient.methodCall(
        'execute_kw',
        [
          db,
          uid,
          password,
          'hr.employee',
          'read',
          [ids],
          {
            fields: ['name'],
          },
        ],
        (err: any, records: Client[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(records);
          }
        },
      );
    });

    return records as Client[];
  } catch (err) {
    console.error('Error getting Odoo employees:', err);
    return [];
  }
}; */

const getOdooOrders = async (uid: number): Promise<any[]> => {
  try {
    const ids = await new Promise((resolve, reject) => {
      modelsClient.methodCall(
        'execute_kw',
        [db, uid, password, 'crm.lead', 'search', [[]]],
        (err: any, ids: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(ids);
          }
        },
      );
    });

    console.log('IDs founded:', ids);

    const records = await new Promise((resolve, reject) => {
      modelsClient.methodCall(
        'execute_kw',
        [db, uid, password, 'crm.lead', 'read', [ids], {}],
        (err: any, records: any[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(records);
          }
        },
      );
    });

    /* fs.writeFile('records.json', JSON.stringify(records, null, 2), (err) => {
      if (err) {
        console.error('Error al guardar el archivo:', err);
      } else {
        console.log('Archivo JSON guardado exitosamente.');
      }
    }); */

    /* await new Promise((resolve, reject) => {
      modelsClient.methodCall(
        'execute_kw',
        [db, uid, password, 'crm.lead', 'write', [[1796], { stage_id: 7 }]],
        (err, value) => {
          if (err) {
            reject(err);
          } else {
            resolve(value);
          }
        },
      );
    });

    console.log('Orden actualizada'); */

    // Leer detalles de los registros
    /* const records = await new Promise((resolve, reject) => {
      modelsClient.methodCall(
        'execute_kw',
        [
          db,
          uid,
          password,
          'crm.lead',
          'read',
          [ids],
          {
            fields: [
              'name',
              'company_id',
              'partner_id',
              'create_date',
              'partner_invoice_id',
              'partner_shipping_id',
              'tax_totals',
              'opportunity_id',
              'avatax_unique_code',
              'health',
            ],
          },
        ],
        (err: any, records: any[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(records);
          }
        },
      );
    }); */

    return records as any[];
  } catch (err) {
    console.error('Error getting Odoo orders:', err);
    return [];
  }
};

export {
  authenticateFromOdoo,
  getOdooVersion,
  // getOdooEmployees,
  getOdooOrders,
};
