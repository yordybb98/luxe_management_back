import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from '@prisma/client';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
    const orderFound = await this.orderService.getOrderById(Number(id));
    if (!orderFound) throw new BadRequestException('Order does not exist');
    return orderFound;
  }

  @Post()
  async createOrder(@Body() data: Order): Promise<Order> {
    return this.orderService.createOrder(data);
  }

  @Put(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() data: Order,
  ): Promise<Order> {
    return this.orderService.updateOrder(Number(id), data);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string): Promise<Order> {
    return this.orderService.deleteOrder(Number(id));
  }
}
