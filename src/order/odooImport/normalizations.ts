import { Order } from 'src/common/types/order';

function normalizeOrder(item: any): Order {
  // Mapping input odoo object to Order type
  const id = item.id;
  const name = item.name as string;
  const description = item.x_studio_order_description || '';
  const techniciansAssignedId = item.x_studio_technicians_assigned
    ? JSON.parse(item.x_studio_technicians_assigned)
    : [];
  const status = {
    id: item.stage_id?.[0],
    name: item.stage_id?.[1],
  };
  const companyName = item.partner_name || '';
  const email = item.email_from || '';
  const phone = item.phone || '';
  const mobile = item.mobile || '';
  const address = item.street || '';
  const website = item.website || '';
  const comments = item.x_studio_comment || '';
  const designersAssignedIds = item.x_studio_designers_assigned
    ? JSON.parse(item.x_studio_designers_assigned)
    : [];
  const tasks = item.x_studio_tasks ? JSON.parse(item.x_studio_tasks) : [];
  const directory = item.x_studio_directory || '';

  return {
    id,
    name,
    description,
    techniciansAssignedId,
    status,
    companyName,
    email,
    phone,
    mobile,
    address,
    website,
    comments,
    designersAssignedIds,
    tasks,
    directory,
  };
}

export { normalizeOrder };
