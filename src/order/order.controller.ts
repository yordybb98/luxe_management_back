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
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { OrderService } from './order.service';
// import { Order } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { Permissions } from 'src/common/decorators/permissions.decorators';
import { GetOrderDto } from './dto/get-order.dto';
import { normalizeOrder } from './odooImport/normalizations';
import {
  authenticateFromOdoo,
  getAllOddoOrders,
  getOdooOrderById,
  getOdooOrdersWithIds,
} from './odooImport/api';
import { Order } from 'src/common/types/order';
import { AssignOrderDto } from './dto/assign-order.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @Permissions('ViewOrders')
  async getAllOrders(
    @Request() req,
    @Query('email') email: string,
  ): Promise<Order[]> {
    // if (email) {
    //   const user = await this.usersService.getUserByEmail(email);
    //   if (!user) throw new NotFoundException('User not found');
    //   return this.orderService.getOrdersByUserEmail(email);
    // }
    // return this.orderService.getAllOrders();

    const token = req.headers.authorization?.split(' ')[1];
    //deserializando token
    const payload = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });

    let orders = [];
    const UID = await authenticateFromOdoo();

    if (payload.role.name !== 'ADMIN') {
      const userOrders = payload.orders;
      orders = await getOdooOrdersWithIds(UID, userOrders);
    } else {
      orders = await getAllOddoOrders(UID);
    }

    const normalizedOrders = normalizeOrder(orders);

    return normalizedOrders;
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string): Promise<Order> {
    const UID = await authenticateFromOdoo();
    const orderFound = await getOdooOrderById(UID, +id);
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

  @Post('assignOrder')
  async assignOrder(
    @Request() req,
    @Body() data: AssignOrderDto,
  ): Promise<void> {
    try {
      //checking if user exists

      const user = await this.usersService.getUserById(data.userId);
      if (!user) throw new BadRequestException('User not found');

      console.log({ data });

      //assigning order
      await this.usersService.assignOrder(data.userId, data.orderId);
    } catch (err) {
      console.log({ err });
      throw new NotFoundException("Order doesn't exist");
    }
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
