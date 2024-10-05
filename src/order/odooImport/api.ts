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

const getOdooOrdersWithIds = async (
  uid: number,
  ordersIDs: number[],
): Promise<any[]> => {
  try {
    // Leer detalles de los registros
    const records = await new Promise((resolve, reject) => {
      modelsClient.methodCall(
        'execute_kw',
        [db, uid, password, 'crm.lead', 'read', [ordersIDs], {}],
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
    console.error('Error getting Odoo orders:', err);
    return [];
  }
};

const getAllOddoOrders = async (uid: number): Promise<any[]> => {
  try {
    const allRecords = await new Promise((resolve, reject) => {
      // Step 1: Get all IDs
      modelsClient.methodCall(
        'execute_kw',
        [db, uid, password, 'crm.lead', 'search', [[]]], // Get all IDs
        (err: any, ids: any[]) => {
          if (err) {
            reject(err);
          } else {
            // Step 2: Use `read` to get details of all records
            modelsClient.methodCall(
              'execute_kw',
              [db, uid, password, 'crm.lead', 'read', [ids]], // Read all records
              (err: any, records: any[]) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(records); // `records` contains details of all records
                }
              },
            );
          }
        },
      );
    });

    return allRecords as any[];
  } catch (err) {
    console.error('Error getting Odoo orders:', err);
    return [];
  }
};

const getOdooOrderById = async (uid: number, id: number): Promise<any> => {
  try {
    const record = await new Promise((resolve, reject) => {
      modelsClient.methodCall(
        'execute_kw',
        [db, uid, password, 'crm.lead', 'read', [id], {}],
        (err: any, record: any[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(record);
          }
        },
      );
    });
    return record as any;
  } catch (err) {
    console.error('Error getting Odoo orders:', err);
    return [];
  }
};

const getOdooStages = async (uid) => {
  try {
    const stages = await new Promise((resolve, reject) => {
      modelsClient.methodCall(
        'execute_kw',
        [
          db,
          uid,
          password,
          'crm.stage',
          'search_read',
          [],
          { fields: ['name'] },
        ],
        (err, stages) => {
          if (err) {
            reject(err);
          } else {
            resolve(stages);
          }
        },
      );
    });
    return stages;
  } catch (err) {
    console.error('Error getting Odoo stages:', err);
    return [];
  }
};

const updateOdooOrder = async (
  uid: number,
  orderId: number,
  propertyKey: string,
  propertyValue: any,
): Promise<any> => {
  try {
    const records = await new Promise((resolve, reject) => {
      modelsClient.methodCall(
        'execute_kw',
        [
          db,
          uid,
          password,
          'crm.lead',
          'write',
          [[orderId], { [propertyKey]: propertyValue }],
          {},
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

    return records as any;
  } catch (err) {
    console.error('Error updating Odoo order:', err);
    return [];
  }
};

const searchOdooOrder = async (
  uid,
  searchKey,
  comparisonOperator,
  searchValue,
): Promise<any[]> => {
  try {
    const orders = await new Promise((resolve, reject) => {
      modelsClient.methodCall(
        'execute_kw',
        [
          db, // Database name
          uid, // User ID
          password, // Password
          'crm.lead', // Model
          'search_read', // Method (search_read)
          [[[searchKey, comparisonOperator, searchValue]]], // Dynamic domain filter
          {},
        ],
        (err, orders) => {
          if (err) {
            reject(err);
          } else {
            resolve(orders);
          }
        },
      );
    });

    return orders as any[];
  } catch (err) {
    console.error('Error fetching orders:', err);
    return [];
  }
};

export {
  authenticateFromOdoo,
  getOdooVersion,
  getOdooStages,
  // getOdooEmployees,
  getOdooOrdersWithIds,
  getAllOddoOrders,
  getOdooOrderById,
  updateOdooOrder,
  searchOdooOrder,
};
