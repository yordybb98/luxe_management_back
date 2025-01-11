import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from 'src/common/types/order';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';
/* import { Cron } from '@nestjs/schedule';
import {
  getOrderOdooStageDurations,
  getOrdersByStages,
  getOrderStageTimeStamp,
} from './odooImport/api'; */
import { formatDuration } from 'src/utils/utils';
import { NotificationService } from 'src/notification/notification.service';
import { STAGES_IDS } from 'settings.config';

@Injectable()
export class OrderService {
  constructor(
    private usersService: UserService,
    //private notificationService: NotificationService,
  ) {}

  // private readonly stageTimeLimits: Record<number, number> = {
  //   [STAGES_IDS.PRODUCTION]: 60000, // 1 hour
  //   [STAGES_IDS.DESIGN]: 180, // 3 hours
  //   [STAGES_IDS.PROPOSITION]: 1440, // 1 day
  // };

  /*   onModuleInit() {
    this.trackOrderStages(); // Run once at startup
  } */

  async getAllOrders(): Promise<Order[]> {
    return [];
  }

  async getOrdersByUserId(id: number): Promise<Order[]> {
    return [];
  }

  async getOrdersByUserEmail(email: string): Promise<Order[]> {
    return [];
  }

  async getOrderById(id: number) {}

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
