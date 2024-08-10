import { Injectable } from '@nestjs/common';
import { Order } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async getAllOrders(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: {
        userAssigned: true,
        status: true,
        project: true,
      },
    });
  }

  async getOrderById(id: number): Promise<Order> {
    return this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        userAssigned: true,
        status: true,
        project: true,
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
        userAssigned: {
          connect: {
            id: data.userId,
          },
        },
        status: {
          connect: {
            id: data.statusId,
          },
        },
        ...(data.projectId && {
          project: {
            connect: {
              id: data.projectId,
            },
          },
        }),
      },
      include: {
        userAssigned: true,
        status: true,
        project: true,
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
        status: true,
        project: true,
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
