import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Put,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly usersService: UserService,
  ) {}

  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
    const orderFound = await this.orderService.getOrderById(Number(id));
    if (!orderFound) throw new NotFoundException('Order not found');
    return orderFound;
  }

  @Post()
  async createOrder(@Body() data: Order): Promise<Order> {
    if (!data.userId) throw new BadRequestException('You must provide userId');
    const user = await this.usersService.getUserById(data.userId);
    if (!user) throw new NotFoundException('User provided not found');
    return this.orderService.createOrder(data);
  }

  @Put(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() data: Order,
  ): Promise<Order> {
    try {
      return await this.orderService.updateOrder(Number(id), data);
    } catch (err) {
      throw new NotFoundException("Order doesn't exist");
    }
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string): Promise<Order> {
    try {
      return await this.orderService.deleteOrder(Number(id));
    } catch (err) {
      throw new NotFoundException("Order doesn't exist");
    }
  }
}
