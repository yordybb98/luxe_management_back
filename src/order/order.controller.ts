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
import {
  authenticateFromOdoo,
  getAllOddoOrders,
  getOdooOrderById,
  getOdooOrdersWithIds,
  searchOdooOrder,
  updateOdooOrder,
} from './odooImport/api';
import { AssignDesignerDto, AssignUserDto } from './dto/assign-order.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { Order } from 'src/common/types/order';
import { normalizeOrder } from './odooImport/normalizations';

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
    const userRoleName = (payload.role.name as string).toLocaleLowerCase();
    if (userRoleName !== 'admin') {
      if (userRoleName === 'designer') {
        orders = await searchOdooOrder(
          UID,
          'x_studio_designer_id',
          payload.sub,
        );
      } else if (userRoleName === 'technician') {
        orders = await searchOdooOrder(
          UID,
          'x_studio_userasigned',
          payload.sub,
        );
      }
      console.log({ orders });
    } else {
      const onlyDevelopOrder = [1796, 200, 525, 127, 905, 368, 111, 1852];
      orders = await getOdooOrdersWithIds(UID, onlyDevelopOrder);
    }

    const normalizedOrders = orders.map((order) => normalizeOrder(order));

    const ordersWithUsers =
      await this.orderService.getOrdersWithUsers(normalizedOrders);

    const ordersWithDesigners =
      await this.orderService.getOrdersWithDesigners(ordersWithUsers);

    return ordersWithDesigners;
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) /* : Promise<Order> */ {
    const UID = await authenticateFromOdoo();
    const orderFound = await getOdooOrderById(UID, +id);

    //checking if order exists
    if (!orderFound) throw new NotFoundException('Order not found');

    //mapping input odoo object to Order type
    const normalizedOrder = normalizeOrder(orderFound[0]);

    const orderWithUser = (
      await this.orderService.getOrdersWithUsers([normalizedOrder])
    )[0];

    return { order: orderFound, normalizedOrder: orderWithUser };
  }

  @Post()
  async createOrder(@Body() data: CreateOrderDto) /* : Promise<Order> */ {
    /* //checking if user exists
    const user = await this.usersService.getUserById(data.userId);
    if (!user) throw new BadRequestException('User not found');

    return this.orderService.createOrder(data); */
  }

  @Post('assignDesigner')
  async assignDesigner(
    @Request() req,
    @Body() data: AssignDesignerDto,
  ): Promise<void> {
    try {
      //checking if user exists

      const user = await this.usersService.getUserById(data.designerId);
      if (!user) throw new BadRequestException('Designer not found');

      const uid = await authenticateFromOdoo();
      await updateOdooOrder(
        uid,
        data.orderId,
        'x_studio_designer_id',
        data.designerId,
      );

      await updateOdooOrder(
        uid,
        data.orderId,
        'x_studio_comment',
        data.comment,
      );

      console.log(
        `Order ${data.orderId} assigned to designer ${data.designerId}`,
      );
    } catch (err) {
      console.log({ err });
      throw new NotFoundException("Order doesn't exist");
    }
  }

  @Post('assignUser')
  async assignUser(@Request() req, @Body() data: AssignUserDto): Promise<void> {
    try {
      //checking if user exists

      const user = await this.usersService.getUserById(data.userId);
      if (!user) throw new BadRequestException('Designer not found');

      const uid = await authenticateFromOdoo();
      await updateOdooOrder(
        uid,
        data.orderId,
        'x_studio_userasigned',
        data.userId,
      );

      await updateOdooOrder(
        uid,
        data.orderId,
        'x_studio_comment',
        data.comment,
      );

      console.log(`Order ${data.orderId} assigned to user ${data.userId}`);
    } catch (err) {
      console.log({ err });
      throw new NotFoundException("Order doesn't exist");
    }
  }

  @Patch(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() data: Order,
  ) /* : Promise<Order>  */ {
    /*  try {
      return await this.orderService.updateOrder(Number(id), data);
    } catch (err) {
      throw new NotFoundException("Order doesn't exist");
    } */
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) /* : Promise<Order> */ {
    /* try {
      return await this.orderService.deleteOrder(Number(id));
    } catch (err) {
      throw new NotFoundException("Order doesn't exist");
    } */
  }
}
