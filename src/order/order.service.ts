import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async getAllOrders(): Promise<Order[]> {
    return this.prisma.order.findMany();
  }

  async getOrderById(id: number): Promise<Order> {
    return this.prisma.order.findUnique({
      where: {
        id,
      },
    });
  }

  async createOrder(data: Order): Promise<Order> {
    return this.prisma.order.create({
      data,
    });
  }

  async updateOrder(id: number, data: Order): Promise<Order> {
    return this.prisma.order.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteOrder(id: number): Promise<Order> {
    return this.prisma.order.delete({
      where: {
        id,
      },
    });
  }
}
