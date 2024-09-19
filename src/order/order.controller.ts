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
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
// import { Order } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { Permissions } from 'src/common/decorators/permissions.decorators';
import { GetOrderDto } from './dto/get-order.dto';
import { normalizeOrder } from './odooImport/normalizations';
import { authenticateFromOdoo, getOdooOrders } from './odooImport/api';
import { Order } from 'src/common/types/order';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly usersService: UserService,
  ) {}

  @Get()
  @Permissions('ViewOrders')
  async getAllOrders(@Query('email') email: string): Promise<Order[]> {
    // if (email) {
    //   const user = await this.usersService.getUserByEmail(email);
    //   if (!user) throw new NotFoundException('User not found');
    //   return this.orderService.getOrdersByUserEmail(email);
    // }
    // return this.orderService.getAllOrders();

    const UID = await authenticateFromOdoo();
    const orders = await getOdooOrders(UID);
    const normalizedOrders = normalizeOrder(orders);

    return normalizedOrders;
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
