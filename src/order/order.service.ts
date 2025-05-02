import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from 'src/common/types/order';
import { UserService } from 'src/user/user.service';
import { Permission, User, UserType } from '@prisma/client';
import { STAGES_IDS } from 'settings.config';
import {
  authenticateFromOdoo,
  getOdooOrderById,
  searchOdooOrder,
} from './odooImport/api';
import { normalizeOrder } from './odooImport/normalizations';
import { PayloadToken } from 'src/common/types/payload';
import { ImageService } from 'src/images/images.service';

@Injectable()
export class OrderService {
  constructor(
    private usersService: UserService,
    private imageService: ImageService,
  ) {}

  async getAllOrders({
    designerId,
    technicianId,
    search,
    stageId,
    page = 1,
    pageSize = 5,
    order = 'create_date DESC',
    userLoggedIn,
  }: {
    designerId?: string;
    technicianId?: string;
    search?: string;
    stageId?: string;
    page?: number;
    pageSize?: number;
    order?: string;
    userLoggedIn: PayloadToken;
  }): Promise<{ allOrders: Order[]; total: number }> {
    //Creating combined domain to filter orders
    const combinedDomain = [];
    // Filtering orders based on designerId param
    if (designerId) {
      if (designerId === '0') {
        combinedDomain.push(
          '|',
          '|',
          ['x_studio_designers_assigned', '=', false], // Check for null/undefined
          ['x_studio_designers_assigned', '=', []], // Check for an empty array
          ['x_studio_designers_assigned', '=', '[]'], // Check for an empty array as string
        );
      } else {
        combinedDomain.push(
        '|', // OR logic
        ['x_studio_designers_assigned', '=', `[${designerId}]`], // Exact match for a single value
        '|', // Additional OR logic
        ['x_studio_designers_assigned', 'like', `[${designerId},%`], // Check if starts with [9,
        '|',
        ['x_studio_designers_assigned', 'like', `,%${designerId},%`], // Check for middle occurrences
        ['x_studio_designers_assigned', 'like', `,%${designerId}]`], // Check if ends with ,9]);
        );
      }
    }

    // Filtering orders based on technicianId param
    if (technicianId) {
      if (technicianId === '0') {
        combinedDomain.push(
          '|',
          '|',
          ['x_studio_technicians_assigned', '=', false], // Check for null/undefined
          ['x_studio_technicians_assigned', '=', []], // Check for an empty array
          ['x_studio_technicians_assigned', '=', '[]'], // Check for an empty array as string
        );
      } else {
        combinedDomain.push([
          'x_studio_technicians_assigned',
          'ilike',
          technicianId,
        ]);
      }
    }

    // Filtering orders based on search param
    if (search) {
      // Searching by phone
      combinedDomain.push('|', ['phone_sanitized', 'ilike', search]);

      // Searching by client name
      combinedDomain.push('|', ['partner_id', 'ilike', search]);

      // Searching by name or description
      combinedDomain.push(
        '|',
        ['name', 'ilike', search],
        ['x_studio_order_description', 'ilike', search],
      );
    }

    // Filtering orders based on stageId param
    if (stageId) combinedDomain.push(['stage_id', '=', +stageId]);

    //Filtering only Luxe Graphics orders
    combinedDomain.push(['company_id', '=', 1]);

    let orders = [];
    let totalOrders = 0;

    //Authenticating Odoo
    const UID = await authenticateFromOdoo();

    //Getting orders from odoo based on user role
    const currentUserType = userLoggedIn.userType;
    const canViewAllOrders = userLoggedIn.role.permissions.includes(
      Permission.ViewAllOrders,
    );

    if (canViewAllOrders) {
      try {
        const { data, total } = await searchOdooOrder({
          uid: UID,
          dynamicDomain: combinedDomain,
          page,
          limit: pageSize,
          order,
        });

        orders = data;
        totalOrders = total;
      } catch (error) {
        throw error;
      }
    } else {
      throw new UnauthorizedException(
        'You do not have permission to view all orders.',
      );
    }

    const normalizedOrders = orders.map((order) => normalizeOrder(order));

    //extracting tasks that are not assigned to the current user (only if user is a technician)
    if (currentUserType === UserType.TECHNICIAN) {
      normalizedOrders.forEach((order) => {
        order.tasks = order.tasks.filter(
          (task) =>
            task.technicianId === userLoggedIn.sub && task.status !== 'ON HOLD',
        );
      });
    }

    const getOrdersWithTechnicians =
      await this.getOrdersWithTechnicians(normalizedOrders);

    const ordersWithDesigners = await this.getOrdersWithDesigners(
      getOrdersWithTechnicians,
    );

    return {
      allOrders: ordersWithDesigners,
      total: totalOrders,
    };
  }

  async getMyOrders({
    designerId,
    technicianId,
    search,
    stageId,
    page,
    pageSize,
    userLoggedIn,
    withoutPagination,
    order,
  }: {
    designerId?: string;
    technicianId?: string;
    search?: string;
    stageId?: string;
    page?: number;
    pageSize?: number;
    order?: string;
    userLoggedIn: PayloadToken;
    withoutPagination?: boolean;
  }): Promise<{ myOrders: Order[]; total: number }> {
    //Creating combined domain to filter orders
    const combinedDomain = [];

    // Filtering orders based on designerId param
    if (designerId) {
      if (designerId === '0') {
        combinedDomain.push(
          '|',
          '|',
          ['x_studio_designers_assigned', '=', false], // Check for null/undefined
          ['x_studio_designers_assigned', '=', []], // Check for an empty array
          ['x_studio_designers_assigned', '=', '[]'], // Check for an empty array as string
        );
      } else {
        combinedDomain.push(
          ['x_studio_designers_assigned', 'ilike', designerId], // Filter by specific designer ID
        );
      }
    }

    // Filtering orders based on technicianId param
    if (technicianId) {
      if (technicianId === '0') {
        combinedDomain.push(
          '|',
          '|',
          ['x_studio_technicians_assigned', '=', false], // Check for null/undefined
          ['x_studio_technicians_assigned', '=', []], // Check for an empty array
          ['x_studio_technicians_assigned', '=', '[]'], // Check for an empty array as string
        );
      } else {
        combinedDomain.push([
          'x_studio_technicians_assigned',
          'ilike',
          technicianId,
        ]);
      }
    }

    // Filtering orders based on search param
    if (search) {
      // Searching by phone
      combinedDomain.push('|', ['phone_sanitized', 'ilike', search]);

      // Searching by client name
      combinedDomain.push('|', ['partner_id', 'ilike', search]);

      // Searching by name or description
      combinedDomain.push(
        '|',
        ['name', 'ilike', search],
        ['x_studio_order_description', 'ilike', search],
      );
    }

    // Filtering orders based on stageId param
    if (stageId) combinedDomain.push(['stage_id', '=', +stageId]);

    //Filtering only Luxe Graphics orders
    combinedDomain.push(['company_id', '=', 1]);

    let orders = [];
    let totalOrders = 0;

    //Authenticating Odoo
    const UID = await authenticateFromOdoo();

    //Getting orders from odoo based on user type
    const currentUserType = userLoggedIn.userType;

    combinedDomain.push(['stage_id', '!=', STAGES_IDS.ON_HOLD]);
    if (currentUserType === UserType.DESIGNER) {
      // Filtering orders based on designerRole

      //Searching the exact value to avoid partial matches like 1 or 10 or 111
      combinedDomain.push(
        '|', // OR logic
        ['x_studio_designers_assigned', '=', `[${userLoggedIn.sub}]`], // Exact match for a single value
        '|', // Additional OR logic
        ['x_studio_designers_assigned', 'like', `[${userLoggedIn.sub},%`], // Check if starts with [9,
        '|',
        ['x_studio_designers_assigned', 'like', `,%${userLoggedIn.sub},%`], // Check for middle occurrences
        ['x_studio_designers_assigned', 'like', `,%${userLoggedIn.sub}]`], // Check if ends with ,9]);
      );

      const { data, total } = await searchOdooOrder({
        uid: UID,
        dynamicDomain: combinedDomain,
        page,
        limit: pageSize,
        order: order ?? 'x_studio_designer_date_assignment DESC',
        withoutPagination,
      });
      orders = data;
      totalOrders = total;
    } else if (currentUserType === UserType.TECHNICIAN) {
      //Filtering orders based on technician Role

      //Searching the exact value to avoid partial matches like 1 or 10 or 111
      combinedDomain.push(
        '|', // OR logic
        ['x_studio_technicians_assigned', '=', `[${userLoggedIn.sub}]`], // Exact match for a single value
        '|', // Additional OR logic
        ['x_studio_technicians_assigned', 'like', `[${userLoggedIn.sub},%`], // Check if starts with [9,
        '|',
        ['x_studio_technicians_assigned', 'like', `,%${userLoggedIn.sub},%`], // Check for middle occurrences
        ['x_studio_technicians_assigned', 'like', `,%${userLoggedIn.sub}]`], // Check if ends with ,9]);
      );
      try {
        const { data, total } = await searchOdooOrder({
          uid: UID,
          dynamicDomain: combinedDomain,
          page,
          limit: pageSize,
          order: order ?? 'x_studio_deadline ASC',
          withoutPagination,
        });
        orders = data;
        totalOrders = total;
      } catch (error) {
        console.log('ERROOOOOOOOOO');
        console.log({ error });
      }
    }

    const normalizedOrders = orders.map((order) => normalizeOrder(order));

    //extracting tasks that are not assigned to the current user (only if user is a technician)
    if (currentUserType === UserType.TECHNICIAN) {
      normalizedOrders.forEach((order) => {
        order.tasks = order.tasks.filter(
          (task) =>
            task.technicianId === userLoggedIn.sub && task.status !== 'ON HOLD',
        );
      });
    }

    const getOrdersWithTechnicians =
      await this.getOrdersWithTechnicians(normalizedOrders);

    const ordersWithDesigners = await this.getOrdersWithDesigners(
      getOrdersWithTechnicians,
    );

    return { myOrders: ordersWithDesigners, total: totalOrders };
  }

  async getOrdersByUserId(id: number): Promise<Order[]> {
    return [];
  }

  async getOrdersByUserEmail(email: string): Promise<Order[]> {
    return [];
  }

  async getOrderById({
    id,
    userLoggedIn,
  }: {
    id: string;
    userLoggedIn: PayloadToken;
  }): Promise<{ order: any; normalizedOrder: Order }> {
    const currentUserType = userLoggedIn.userType;
    const UID = await authenticateFromOdoo();
    const orderFound = await getOdooOrderById(UID, +id);

    //checking if order exists
    if (!orderFound.length) throw new NotFoundException('Order not found');

    //mapping input odoo object to Order type
    const normalizedOrder = normalizeOrder(orderFound[0]);

    //extracting tasks that are not assigned to the current user (only if user is a technician)
    if (currentUserType === UserType.TECHNICIAN) {
      normalizedOrder.tasks = normalizedOrder.tasks.filter(
        (task) =>
          task.technicianId === userLoggedIn.sub && task.status !== 'ON HOLD',
      );
    }

    const orderWithTechnicians = (
      await this.getOrdersWithTechnicians([normalizedOrder])
    )[0];

    const orderWithDesigners = (
      await this.getOrdersWithDesigners([orderWithTechnicians])
    )[0];

    //Getting order images only if directory exists
    if (orderWithDesigners.directory) {
      try {
        const orderImages = await this.imageService.getAllImages(
          orderWithDesigners.directory,
        );
        orderWithDesigners.images = orderImages;
      } catch (error) {
        console.error('Error reading images:', error);
        orderWithDesigners.images = [];
      }
    }

    //Add assigner name to each task
    for (const task of orderWithDesigners.tasks) {
      if (task.assignedBy && !task.assignerName) {
        const assigner = await this.usersService.getUserById(task.assignedBy);
        if (assigner) task.assignerName = assigner.name;
      }
    }

    return { order: orderFound, normalizedOrder: orderWithDesigners };
  }

  async getOrdersWithTechnicians(orders: Order[]): Promise<Order[]> {
    return await Promise.all(
      orders.map(async (order) => {
        if (order.techniciansAssignedId) {
          try {
            let techniciansAssigned: User[] = [];

            for (const technicianId of order.techniciansAssignedId) {
              const technicianData =
                await this.usersService.getUserById(technicianId);
              techniciansAssigned.push(technicianData);
            }

            return { ...order, techniciansAssigned };
          } catch (error) {
            console.error(
              `Failed to fetch technician for order ${order.id}:`,
              error,
            );
            return { ...order, techniciansAssigned: null };
          }
        }
        return { ...order, techniciansAssigned: null };
      }),
    );
  }

  async getOrdersWithDesigners(orders: Order[]): Promise<Order[]> {
    return await Promise.all(
      orders.map(async (order) => {
        if (order.designersAssignedIds) {
          try {
            let designersAssigned: User[] = [];

            for (const designerId of order.designersAssignedIds) {
              const designerData =
                await this.usersService.getUserById(designerId);
              designersAssigned.push(designerData);
            }
            return { ...order, designersAssigned };
          } catch (error) {
            console.error(
              `Failed to fetch designer for order ${order.id}:`,
              error,
            );
            return { ...order, designersAssigned: null };
          }
        }
        return { ...order, designersAssigned: null };
      }),
    );
  }

  async createOrder(data: CreateOrderDto) {}

  async updateOrder(id: number, data: Order) {}

  async deleteOrder(id: number) {}

  async assignUser(id: number, data: Order): Promise<void> {
    return;
  }

  /*   @Cron('5 * * * * *')
  async trackOrderStages() {
    try {
      console.log('TRACKING ORDER STAGES');
      const startTime = Date.now();
      const stageIds = [
        // STAGES_IDS.ANTICIPO,
        // STAGES_IDS.DESIGN,Propuesta
        STAGES_IDS.PROPOSITION,
        // STAGES_IDS.ADJUSTMENT_1,
        // STAGES_IDS.ADJUSTMENT_2,
        // STAGES_IDS.ADJUSTMENT_FINAL,
        // STAGES_IDS.APROVED_BY_CLIENT,
        // STAGES_IDS.PRODUCTION,
        // STAGES_IDS.INSTALLATION,
      ];
      const orders = await getOrdersByStages(stageIds);
      const notification = [];
      if (orders.length === 0) return;

      for (const order of orders) {
        const stageDurations = await getOrderOdooStageDurations(order.id);
        if (!stageDurations.length) continue; // Skip if no stage data

        const lastStage = stageDurations[stageDurations.length - 1];
        if (lastStage.duration > this.stageTimeLimits[order.stage_id[0]]) {
          notification.push(
            `⚠️ Order ${order.id} in stage ${order.stage_id[0]} has been delayed for ${formatDuration(
              lastStage.duration - this.stageTimeLimits[order.stage_id[0]],
            )}.`,
          );
        }
      }

      console.log({ notification });

      notification.forEach(async (message) => {
        await this.notificationService.notifyAllAdmins({
          type: 'WARNING',
          message,
        });
      });

      console.log(formatDuration(Date.now() - startTime));
    } catch (error) {}
  } */
}
