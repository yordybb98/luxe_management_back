import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from 'src/common/types/order';
import { UserService } from 'src/user/user.service';

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

  async getOrdersWithUsers(orders: Order[]): Promise<Order[]> {
    return await Promise.all(
      orders.map(async (order) => {
        if (order.userAssignedId) {
          try {
            const user = await this.usersService.getUserById(
              order.userAssignedId,
            );
            return { ...order, userAssigned: user };
          } catch (error) {
            console.error(`Failed to fetch user for order ${order.id}:`, error);
            return { ...order, userAssigned: null };
          }
        }
        return { ...order, userAssigned: null };
      }),
    );
  }

  async getOrdersWithDesigners(orders: Order[]): Promise<Order[]> {
    return await Promise.all(
      orders.map(async (order) => {
        if (order.designerId) {
          try {
            const user = await this.usersService.getUserById(order.designerId);
            return { ...order, designerAssigned: user };
          } catch (error) {
            console.error(
              `Failed to fetch designer for order ${order.id}:`,
              error,
            );
            return { ...order, designerAssigned: null };
          }
        }
        return { ...order, designerAssigned: null };
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
