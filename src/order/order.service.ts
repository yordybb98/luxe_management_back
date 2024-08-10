import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async getAllOrders(): Promise<Order[]> {
    return this.prisma.order.findMany({ include: { userAssigned: true } });
  }

  async getOrderById(id: number): Promise<Order> {
    return this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        userAssigned: true,
      },
    });
  }

  async createOrder(data: CreateOrderDto): Promise<Order> {
    return this.prisma.order.create({
      data: {
        name: data.name,
        phone: data.phone,
        address: data.address,
        description: data.description,
        status: data.status,
        userAssigned: {
          connect: {
            id: data.userId,
          },
        },
      },
      include: {
        userAssigned: true,
      },
    });
  }

  async updateOrder(id: number, data: Order): Promise<Order> {
    return this.prisma.order.update({
      where: {
        id,
      },
      data,
      include: {
        userAssigned: true,
      },
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
