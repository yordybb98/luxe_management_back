import { Order } from 'src/common/types/order';

function normalizeOrder(data: any[]): Order[] {
  // Mapeo de campos del objeto de entrada a los campos del tipo Order
  /* return data.map((item) => ({
    id: item.id as number,
    name: item.partner_id[1] as string,
    description: (item.opportunity_id[1] || '') as string,
    status: {
      id: (item.status_id ?? 0) as number,
      name: (item.status_name ?? '') as string,
    },
    statusId: (item.status_id ?? 0) as number,
    userId: (item.user_id ?? 0) as number,
    projectId: (item.project_id ?? 0) as number,
    clientId: (item.client_id ?? 0) as number,
  })); */

  console.log({ data });

  return data.map((item) => ({
    id: item.id as number,
    name: item.name as string,
    description: item.email as string,
    status: {
      id: (item.status_id ?? 0) as number,
      name: (item.status_name ?? '') as string,
    },
    statusId: (item.status_id ?? 0) as number,
    userId: (item.user_id ?? 0) as number,
    projectId: (item.project_id ?? 0) as number,
    clientId: (item.client_id ?? 0) as number,
  }));
}

export { normalizeOrder };
