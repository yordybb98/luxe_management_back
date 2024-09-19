import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from 'src/common/types/order';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async getAllOrders(): Promise<Order[]> {
    return [];
  }

  async getOrdersByUserId(id: number): Promise<Order[]> {
    return [];
  }

  async getOrdersByUserEmail(email: string): Promise<Order[]> {
    return [];
  }

  async getOrderById(id: number): Promise<Order> {
    return {
      id: 1,
      name: 'test',
      description: 'test',
      statusId: 1,
    };
  }

  async createOrder(data: CreateOrderDto): Promise<Order> {
    return {
      id: 1,
      name: 'test',
      description: 'test',
      statusId: 1,
    };
  }

  async updateOrder(id: number, data: Order): Promise<Order> {
    return {
      id: 1,
      name: 'test',
      description: 'test',
      statusId: 1,
    };
  }

  async deleteOrder(id: number): Promise<Order> {
    return {
      id: 1,
      name: 'test',
      description: 'test',
      statusId: 1,
    };
  }
}
