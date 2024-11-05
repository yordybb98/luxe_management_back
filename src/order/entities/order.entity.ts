import { User } from '@prisma/client';

export class Order {
  id: number;
  name: string;
  phone: string;
  address: string;
  description: string;
  statusId: number;
  userId: number;
}

export type OdooOrder = {
  id: number;
  duration_tracking: Record<string, number>; // Using a record for the duration tracking
  campaign_id: boolean | false;
  source_id: boolean | false;
  medium_id: boolean | false;
  activity_ids: any[]; // Specify the type if known
  activity_state: boolean | false;
  activity_user_id: boolean | false;
  activity_type_id: boolean | false;
  activity_type_icon: boolean | false;
  activity_date_deadline: boolean | false;
  my_activity_date_deadline: boolean | false;
  activity_summary: boolean | false;
  activity_exception_decoration: boolean | false;
  activity_exception_icon: boolean | false;
  activity_calendar_event_id: boolean | false;
  message_is_follower: boolean | false;
  message_follower_ids: number[];
  message_partner_ids: number[];
  message_ids: number[];
  has_message: boolean;
  message_needaction: boolean;
  message_needaction_counter: number;
  message_has_error: boolean;
  message_has_error_counter: number;
  message_attachment_count: number;
  rating_ids: any[]; // Specify the type if known
  website_message_ids: number[];
  message_has_sms_error: boolean;
  phone_sanitized: string;
  phone_sanitized_blacklisted: boolean;
  phone_blacklisted: boolean;
  mobile_blacklisted: boolean;
  phone_mobile_search: boolean;
  email_normalized: string;
  is_blacklisted: boolean;
  message_bounce: number;
  email_cc: boolean | false;
  name: string;
  user_id: (number | string)[];
  user_company_ids: number[];
  team_id: (number | string)[];
  lead_properties: any[]; // Specify the type if known
  company_id: (number | string)[];
  referred: boolean;
  description: string;
  active: boolean;
  type: string;
  priority: string;
  stage_id: (number | string)[];
  kanban_state: string;
  tag_ids: any[]; // Specify the type if known
  color: number;
  expected_revenue: number;
  prorated_revenue: number;
  recurring_revenue: number;
  recurring_plan: boolean;
  recurring_revenue_monthly: number;
  recurring_revenue_monthly_prorated: number;
  recurring_revenue_prorated: number;
  company_currency: (number | string)[];
  date_closed: string; // Consider using Date type if needed
  date_automation_last: string; // Consider using Date type
  date_open: string; // Consider using Date type
  day_open: number;
  day_close: number;
  date_last_stage_update: string; // Consider using Date type
  date_conversion: boolean | false;
  date_deadline: boolean | false;
  partner_id: (number | string)[];
  partner_is_blacklisted: boolean;
  contact_name: boolean | false;
  partner_name: string;
  function: boolean | false;
  title: boolean | false;
  email_from: string;
  email_domain_criterion: string;
  phone: string | false;
  mobile: string;
  phone_state: boolean | false;
  email_state: string;
  website: string | false;
  lang_id: (number | string)[];
  lang_code: string;
  lang_active_count: number;
  street: string;
  street2: boolean | false;
  zip: string;
  city: string;
  state_id: (number | string)[];
  country_id: (number | string)[];
  probability: number;
  automated_probability: number;
  is_automated_probability: boolean;
  lost_reason_id: boolean | false;
  calendar_event_ids: any[]; // Specify the type if known
  duplicate_lead_ids: number[];
  duplicate_lead_count: number;
  meeting_display_date: boolean | false;
  meeting_display_label: string;
  partner_email_update: boolean | false;
  partner_phone_update: boolean | false;
  is_partner_visible: boolean;
  display_name: string;
  create_uid: (number | string)[];
  create_date: string; // Consider using Date type
  write_uid: (number | string)[];
  write_date: string; // Consider using Date type
  won_status: string;
  days_to_convert: number;
  days_exceeding_closing: number;
  reveal_id: boolean | false;
  visitor_ids: any[]; // Specify the type if known
  visitor_page_count: number;
  iap_enrich_done: boolean;
  show_enrich_button: boolean;
  lead_mining_request_id: boolean | false;
  visitor_sessions_count: number;
  sale_amount_total: number;
  quotation_count: number;
  sale_order_count: number;
  order_ids: number[];
  partner_latitude: number;
  partner_longitude: number;
  partner_assigned_id: boolean | false;
  partner_declined_ids: any[]; // Specify the type if known
  date_partner_assign: boolean | false;
  x_studio_order_description: string;
  x_studio_comment: string;
  x_studio_designers_assigned: string; // Assuming this is a JSON string
  x_studio_tasks: string; // Assuming this is a JSON string
  x_studio_directory: string;
  x_studio_technicians_assigned: string; // Assuming this is a JSON string
  x_studio_designer_date_assignment: string; // Consider using Date type
  x_studio_first_adjustment_check: boolean | false;
  x_studio_first_adjustment_description: string | false;
  x_studio_second_adjustment_check: boolean | false;
  x_studio_second_adjustment_description: string | false;
  x_studio_final_adjustment_check: boolean | false;
  x_studio_final_adjustment_description: string | false;
};
