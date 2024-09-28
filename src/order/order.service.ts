import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from 'src/common/types/order';
import { UserService } from 'src/user/user.service';
import { User } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private usersService: UserService,
  ) {}

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
}
