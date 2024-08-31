import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/createUserDto';
import { CreateOrderDto } from './dto/create-order.dto';
import { StatusService } from 'src/status/status.service';
import { Permissions } from 'src/common/decorators/permissions.decorators';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly usersService: UserService,
    private readonly statusService: StatusService,
  ) {}

  @Get()
  @Permissions('ViewOrders')
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
  async createOrder(@Body() data: CreateOrderDto): Promise<Order> {
    //checking if user exists
    const user = await this.usersService.getUserById(data.userId);
    if (!user) throw new BadRequestException('User not found');

    //checking if status exists
    const status = await this.statusService.getStatusById(data.statusId);
    if (!status) throw new BadRequestException('Status not found');

    return this.orderService.createOrder(data);
  }

  @Patch(':id')
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
