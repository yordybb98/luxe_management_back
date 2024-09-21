import { Order } from 'src/common/types/order';

function normalizeOrder(item: any): Order {
  // Mapping input odoo object to Order type
  const id = item.id;
  const name = item.name as string;
  const description = item.x_studio_order_description || '';
  const userAssignedId = item.x_studio_userasigned as number;
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
  const designerId = item.x_studio_designer_id || 0;

  return {
    id,
    name,
    description,
    userAssignedId,
    status,
    companyName,
    email,
    phone,
    mobile,
    address,
    website,
    comments,
    designerId,
  };
}

export { normalizeOrder };
