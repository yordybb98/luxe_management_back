import { OdooOrder, Order } from 'src/common/types/order';
import { Stage } from 'src/common/types/stage';

function normalizeOrder(item: OdooOrder): Order {
  // Mapping input odoo object to Order type
  const id = item.id;
  const name = item.name as string;
  const description = item.x_studio_order_description || '';
  const techniciansAssignedId = item.x_studio_technicians_assigned
    ? JSON.parse(item.x_studio_technicians_assigned)
    : [];
  const stage = {
    id: item.stage_id?.[0],
    name: item.stage_id?.[1],
  } as Stage;
  const companyName = (item.partner_id[1] as string) || '';
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
  const created_at = item.create_date ? new Date(item.create_date) : null;
  const designerAssigmentDate = item.x_studio_designer_date_assignment
    ? new Date(JSON.parse(item.x_studio_designer_date_assignment))
    : null;
  const firstAdjustment = item.x_studio_first_adjustment_description || '';
  const secondAdjustment = item.x_studio_second_adjustment_description || '';
  const finalAdjustment = item.x_studio_final_adjustment_description || '';

  return {
    id,
    name,
    description,
    techniciansAssignedId,
    stage,
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
    created_at,
    designerAssigmentDate,
    firstAdjustment,
    secondAdjustment,
    finalAdjustment,
  };
}

export { normalizeOrder };
