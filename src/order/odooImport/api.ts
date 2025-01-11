import { STAGES_IDS } from 'settings.config';
import { OdooOrder } from 'src/common/types/order';
import {
  filterStageTransitions,
  formatDuration,
  timeToLocalTimeZone,
} from 'src/utils/utils';

const xmlrpc = require('xmlrpc');

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

const getAllOddoOrders = async (
  uid: number,
  page: number = 1,
  limit: number = 5,
  search: string = '',
  stageId?: number,
): Promise<{ data: OdooOrder[]; total: number }> => {
  const offset = (page - 1) * limit;
  const searchDomain = search
    ? [
        '|',
        ['name', 'ilike', search],
        ['x_studio_order_description', 'ilike', search],
      ]
    : [];

  const stageDomain = stageId ? [['stage_id', '=', stageId]] : [];
  const combinedDomain = [...stageDomain, ...searchDomain];

  const orders = (await new Promise((resolve, reject) => {
    modelsClient.methodCall(
      'execute_kw',
      [
        db,
        uid,
        password,
        'crm.lead',
        'search_read',
        [combinedDomain],
        { offset, limit, order: 'create_date DESC' },
      ],
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      },
    );
  })) as OdooOrder[];

  const totalOrders = (await new Promise((resolve, reject) => {
    modelsClient.methodCall(
      'execute_kw',
      [db, uid, password, 'crm.lead', 'search_count', [combinedDomain]],
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      },
    );
  })) as number;
  return { data: orders, total: totalOrders };
};

const getOdooOrderById = async (uid: number, id: number): Promise<any> => {
  try {
    const record = await new Promise((resolve, reject) => {
      modelsClient.methodCall(
        'execute_kw',
        [
          db,
          uid,
          password,
          'crm.lead',
          'search_read',
          [
            [
              ['id', '=', id],
              ['company_id', '=', 1],
            ],
          ],
        ],
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

const getOdooStages = async (uid: number, team_id?: number) => {
  try {
    const filterDomain = team_id ? [[['team_id', '=', team_id]]] : [];
    const stages = await new Promise((resolve, reject) => {
      modelsClient.methodCall(
        'execute_kw',
        [
          db,
          uid,
          password,
          'crm.stage',
          'search_read',
          filterDomain,
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

const getOdooTeams = async (uid) => {
  try {
    const teams = await new Promise((resolve, reject) => {
      modelsClient.methodCall(
        'execute_kw',
        [
          db,
          uid,
          password,
          'crm.team',
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
    return teams;
  } catch (err) {
    console.error('Error getting Odoo teams:', err);
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
  dynamicDomain: any[] = [],
  page: number = 1,
  limit: number = 5,
  order: string = 'create_date DESC',
): Promise<{ data: OdooOrder[]; total: number }> => {
  try {
    const offset = (page - 1) * limit;

    const orders = (await new Promise((resolve, reject) => {
      modelsClient.methodCall(
        'execute_kw',
        [
          db, // Database name
          uid, // User ID
          password, // Password
          'crm.lead', // Model
          'search_read', // Method (search_read)
          [dynamicDomain], // Dynamic domain filter
          { offset, limit, order }, // Dynamic fields
        ],
        (err, orders) => {
          if (err) {
            reject(err);
          } else {
            resolve(orders);
          }
        },
      );
    })) as OdooOrder[];

    const total = (await new Promise((resolve, reject) => {
      modelsClient.methodCall(
        'execute_kw',
        [
          db, // Database name
          uid, // User ID
          password, // Password
          'crm.lead', // Model
          'search_count', // Method (search_read)
          [dynamicDomain], // Dynamic domain filter
        ],
        (err, orders) => {
          if (err) {
            reject(err);
          } else {
            resolve(orders);
          }
        },
      );
    })) as number;

    return { data: orders, total };
  } catch (err) {
    console.error('Error fetching orders:', err);
    return { data: [], total: 0 };
  }
};

const countAllOdooOrders = async (): Promise<number> => {
  const uid = await authenticateFromOdoo();
  return new Promise((resolve, reject) => {
    modelsClient.methodCall(
      'execute_kw',
      [
        db,
        uid,
        password, // Password
        'crm.lead',
        'search_count',
        [[]],
      ],
      (err, count) => {
        if (err) {
          reject(err);
        } else {
          resolve(count);
        }
      },
    );
  });
};

const getOrderOdooStageDurations = async (
  orderId: number,
): Promise<{ stage: string; duration: number }[]> => {
  const uid = await authenticateFromOdoo();

  // Step 1: Fetch related messages for the order
  const messageIds = await new Promise<number[]>((resolve, reject) => {
    modelsClient.methodCall(
      'execute_kw',
      [
        db,
        uid,
        password,
        'mail.message',
        'search_read',
        [
          [
            ['res_id', '=', orderId],
            ['model', '=', 'crm.lead'], // Adjust the model as needed
          ],
          ['id'],
        ],
      ],
      (err, messages) => {
        if (err) {
          return reject(err);
        }
        resolve(messages.map((m) => m.id));
      },
    );
  });

  // Step 2: Fetch tracking values for the messages
  const trackingValues = await new Promise<any[]>((resolve, reject) => {
    modelsClient.methodCall(
      'execute_kw',
      [
        db,
        uid,
        password,
        'mail.tracking.value',
        'search_read',
        [
          [['mail_message_id', 'in', messageIds]],
          ['create_date', 'field_id', 'old_value_char', 'new_value_char'],
        ],
      ],
      (err, values) => {
        if (err) {
          return reject(err);
        }
        resolve(values);
      },
    );
  });

  // Step 3: Filter the tracking values
  const relevantChanges = filterStageTransitions(trackingValues);

  // Step 4: Process filtered values
  const stages: { stage: string; duration: number }[] = [];

  relevantChanges.sort(
    (a, b) =>
      new Date(a.create_date).getTime() - new Date(b.create_date).getTime(),
  );

  for (let i = 0; i < relevantChanges.length; i++) {
    const current = relevantChanges[i];
    const startTime = new Date(current.create_date);
    const nextTime =
      i === relevantChanges.length - 1
        ? new Date(Date.now() + 5 * 60 * 60 * 1000)
        : new Date(relevantChanges[i + 1].create_date);

    const durationMs = Math.abs(nextTime.getTime() - startTime.getTime());

    stages.push({
      stage: current.new_value_char || 'Unknown',
      duration: durationMs,
    });
  }

  return stages;
};

const getOrderOdooStageTimeline = async (
  orderId: number,
): Promise<
  { stage: string; startTime: string; endTime: string; duration: string }[]
> => {
  const uid = await authenticateFromOdoo();

  // Step 1: Fetch related messages for the order
  const messageIds = await new Promise<number[]>((resolve, reject) => {
    modelsClient.methodCall(
      'execute_kw',
      [
        db,
        uid,
        password,
        'mail.message',
        'search_read',
        [
          [
            ['res_id', '=', orderId],
            ['model', '=', 'crm.lead'], // Adjust the model as needed
          ],
          ['id'],
        ],
      ],
      (err, messages) => {
        if (err) {
          return reject(err);
        }
        resolve(messages.map((m) => m.id));
      },
    );
  });

  // Step 2: Fetch tracking values for the messages
  const trackingValues = await new Promise<any[]>((resolve, reject) => {
    modelsClient.methodCall(
      'execute_kw',
      [
        db,
        uid,
        password,
        'mail.tracking.value',
        'search_read',
        [
          [['mail_message_id', 'in', messageIds]],
          ['create_date', 'field_id', 'old_value_char', 'new_value_char'],
        ],
      ],
      (err, values) => {
        if (err) {
          return reject(err);
        }
        resolve(values);
      },
    );
  });

  // Step 3: Filter tracking values for stage changes
  const stageChanges = filterStageTransitions(trackingValues);

  // Step 4: Sort changes chronologically
  stageChanges.sort(
    (a, b) =>
      new Date(a.create_date).getTime() - new Date(b.create_date).getTime(),
  );

  // Step 5: Build the timeline
  const timeline: {
    stage: string;
    startTime: string;
    endTime: string;
    duration: string;
  }[] = [];

  for (let i = 0; i < stageChanges.length; i++) {
    const current = stageChanges[i];
    const timeZoneOffsetMs =
      new Date(current.create_date).getTimezoneOffset() * 60 * 1000; // Get the timezone offset in milliseconds;
    const startTime = timeToLocalTimeZone(
      current.create_date,
      timeZoneOffsetMs,
    );
    const endTime =
      i === stageChanges.length - 1
        ? new Date(Date.now())
        : timeToLocalTimeZone(
            stageChanges[i + 1].create_date,
            timeZoneOffsetMs,
          );

    const durationMs = Math.abs(endTime.getTime() - startTime.getTime());

    timeline.push({
      stage: current.new_value_char || 'Unknown',
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration: formatDuration(durationMs),
    });
  }

  return timeline;
};

const getOrderStageTimeStamp = async (orderId: number) => {
  const uid = await authenticateFromOdoo();

  // Step 1: Fetch related messages for the order
  const messageIds = await new Promise<number[]>((resolve, reject) => {
    modelsClient.methodCall(
      'execute_kw',
      [
        db,
        uid,
        password,
        'mail.message',
        'search_read',
        [
          [
            ['res_id', '=', orderId],
            ['model', '=', 'crm.lead'], // Adjust the model as needed
          ],
          ['id'],
        ],
      ],
      (err, messages) => {
        if (err) {
          return reject(err);
        }
        resolve(messages.map((m) => m.id));
      },
    );
  });

  const trackingValues = await new Promise<any[]>((resolve, reject) => {
    modelsClient.methodCall(
      'execute_kw',
      [
        db,
        uid,
        password,
        'mail.tracking.value',
        'search_read',
        [
          [['mail_message_id', 'in', messageIds]],
          ['create_date', 'field_id', 'old_value_char', 'new_value_char'],
        ],
      ],
      (err, values) => {
        if (err) {
          return reject(err);
        }
        resolve(values);
      },
    );
  });

  const relevantChanges = filterStageTransitions(trackingValues);

  return relevantChanges;
};

export const getOrdersByStages = async (stageIds: number[]) => {
  const uid = await authenticateFromOdoo();

  const result = await new Promise<any[]>((resolve, reject) => {
    modelsClient.methodCall(
      'execute_kw',
      [
        db,
        uid,
        password,
        'crm.lead',
        'search_read',
        [[['stage_id', 'in', stageIds]]],
        { fields: ['id', 'stage_id'] },
      ],
      (err, values) => {
        if (err) {
          return reject(err);
        }
        resolve(values);
      },
    );
  });

  return result;
};

export {
  authenticateFromOdoo,
  getOdooVersion,
  getOdooStages,
  // getOdooEmployees,
  getOdooOrdersWithIds,
  getOdooOrderById,
  updateOdooOrder,
  searchOdooOrder,
  getAllOddoOrders,
  countAllOdooOrders,
  getOdooTeams,
  getOrderOdooStageDurations,
  getOrderOdooStageTimeline,
  getOrderStageTimeStamp,
};
