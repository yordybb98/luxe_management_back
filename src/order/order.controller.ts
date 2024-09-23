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
import { Task } from 'src/common/types/tasks';
import { randomUUID } from 'crypto';

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

  @Post(':id/finish')
  async finishOrder(@Param('id') id: string) /* : Promise<Order> */ {
    const UID = await authenticateFromOdoo();
    const orderFound = await getOdooOrderById(UID, +id);

    if (!orderFound) throw new NotFoundException('Order not found');

    //Removing user assignment from order
    await updateOdooOrder(UID, +id, 'x_studio_userasigned', '');

    //Removing designer assignment from order
    await updateOdooOrder(UID, +id, 'x_studio_designer_id', '');

    //Changing order status
    await updateOdooOrder(UID, +id, 'stage_id', 5);
  }

  @Post(':orderId/finishTask/:taskId')
  async finishTask(
    @Param('orderId') id: string,
    @Param('taskId') taskId: string,
  ) /* : Promise<Order> */ {
    const UID = await authenticateFromOdoo();

    //Founding order
    const orderFound = await getOdooOrderById(UID, +id);
    if (!orderFound) throw new NotFoundException('Order not found');

    //Founding task
    const normalizedOrder = normalizeOrder(orderFound[0]);
    const taskFound =
      normalizedOrder.tasks.id.toLowerCase() === taskId.toLowerCase();
    if (!taskFound) throw new NotFoundException('Task not found');
    const task = normalizedOrder.tasks;

    //Removing user assignment from order
    await updateOdooOrder(UID, +id, 'x_studio_userasigned', '');

    //Defining task finished date
    task.dateFinished = new Date();

    //Completing task
    task.status = 'COMPLETED';

    //Stringify task
    const updatedTask = JSON.stringify(task);

    //Updating task
    await updateOdooOrder(UID, +id, 'x_studio_tasks', updatedTask);
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

      //Authenticating Odoo
      const uid = await authenticateFromOdoo();

      //Changing order status to Production
      await updateOdooOrder(uid, data.orderId, 'stage_id', 10);

      //Assigning designer
      await updateOdooOrder(
        uid,
        data.orderId,
        'x_studio_designer_id',
        data.designerId,
      );

      //Adding comment
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

      const user = await this.usersService.getUserById(data.technicianId);
      if (!user) throw new BadRequestException('Technician not found');

      const uid = await authenticateFromOdoo();
      await updateOdooOrder(
        uid,
        data.orderId,
        'x_studio_userasigned',
        data.technicianId,
      );

      const newTask = JSON.stringify({
        id: randomUUID(),
        technicianId: data.technicianId,
        dateAssigned: new Date(),
        instructions: data.instructions,
        status: 'IN-PROGRESS',
      });

      await updateOdooOrder(uid, data.orderId, 'x_studio_tasks', newTask);

      console.log(
        `Order ${data.orderId} assigned to user ${user.name} with id ${data.technicianId}`,
      );
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
