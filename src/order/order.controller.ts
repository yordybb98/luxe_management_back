import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  NotFoundException,
  BadRequestException,
  ServiceUnavailableException,
  Patch,
  Query,
  Request,
} from '@nestjs/common';
import { OrderService } from './order.service';
// import { Order } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { Permissions } from 'src/common/decorators/permissions.decorators';
import {
  authenticateFromOdoo,
  getAllOddoOrders,
  getOdooOrderById,
  searchOdooOrder,
  updateOdooOrder,
} from './odooImport/api';
import { AssignDesignerDto, AssignUserDto } from './dto/assign-order.dto';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { Order } from 'src/common/types/order';
import { normalizeOrder } from './odooImport/normalizations';
import { randomUUID } from 'crypto';
import { createFolders, sanitizePathName } from 'src/utils/utils';
import { settings } from 'settings.config';
import { Task } from 'src/common/types/tasks';
import { GetAllOrdersResponseDto } from './dto/get-all-orders-response.dto';
import { Permission } from '@prisma/client';
import { EditTaskDto } from './dto/edit-task.dto';
const path = require('path');

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @Permissions(Permission.ViewOrders)
  async getAllOrders(
    @Request() req,
    @Query('page') page,
    @Query('pageSize') pageSize,
    @Query('stageId') stageId,
    @Query('search') search,
    @Query('designerId') designerId,
    @Query('technicianId') technicianId,
  ): Promise<GetAllOrdersResponseDto> {
    const token = req.headers.authorization?.split(' ')[1];
    //deserializando token
    const payload = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });

    //Creating combined domain to filter orders
    const combinedDomain = [];

    // Filtering orders based on search param
    if (search)
      combinedDomain.push(
        '|',
        ['name', 'ilike', search],
        ['x_studio_order_description', 'ilike', search],
      );

    // Filtering orders based on stageId param
    if (stageId) combinedDomain.push(['stage_id', '=', +stageId]);

    // Filtering orders based on designerId param
    if (designerId)
      combinedDomain.push(['x_studio_designers_assigned', 'ilike', designerId]);

    // Filtering orders based on technicianId param
    if (technicianId)
      combinedDomain.push([
        'x_studio_technicians_assigned',
        'ilike',
        technicianId,
      ]);

    let orders = [];
    let totalOrders = 0;

    //Authenticating Odoo
    const UID = await authenticateFromOdoo();

    //Getting orders from odoo based on user role
    const userRoleName = (payload.role.name as string).toLocaleLowerCase();
    const canViewAllOrders = payload.role.permissions.includes(
      Permission.ViewAllOrders,
    );
    if (canViewAllOrders) {
      const { data, total } = await searchOdooOrder(
        UID,
        combinedDomain,
        page,
        pageSize,
      );

      orders = data;
      totalOrders = total;
    } else {
      if (userRoleName === 'designer') {
        // Filtering orders based on designerRole
        combinedDomain.push([
          'x_studio_designers_assigned',
          'ilike',
          payload.sub,
        ]);

        const { data, total } = await searchOdooOrder(
          UID,
          combinedDomain,
          page,
          pageSize,
        );
        orders = data;
        totalOrders = total;
      } else if (userRoleName === 'technician') {
        // Filtering orders based on technicianRole
        combinedDomain.push([
          'x_studio_technicians_assigned',
          'ilike',
          payload.sub,
        ]);

        const { data, total } = await searchOdooOrder(
          UID,
          combinedDomain,
          page,
          pageSize,
        );
        orders = data;
        totalOrders = total;
      }
    }

    const normalizedOrders = orders.map((order) => normalizeOrder(order));

    //extracting tasks that are not assigned to the current user (only if user is a technician)
    if (userRoleName === 'technician') {
      normalizedOrders.forEach((order) => {
        order.tasks = order.tasks.filter(
          (task) => task.technicianId === payload.sub,
        );
      });
    }

    const getOrdersWithTechnicians =
      await this.orderService.getOrdersWithTechnicians(normalizedOrders);

    const ordersWithDesigners = await this.orderService.getOrdersWithDesigners(
      getOrdersWithTechnicians,
    );

    return { data: ordersWithDesigners, total: totalOrders };
  }

  @Get(':id')
  @Permissions(Permission.ViewOrders)
  async getOrderById(
    @Param('id') id: string,
    @Request() req,
  ) /* : Promise<Order> */ {
    const UID = await authenticateFromOdoo();
    const orderFound = await getOdooOrderById(UID, +id);

    const token = req.headers.authorization?.split(' ')[1];
    //deserializando token
    const payload = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });
    const userRoleName = (payload.role.name as string).toLocaleLowerCase();

    //checking if order exists
    if (!orderFound) throw new NotFoundException('Order not found');

    //mapping input odoo object to Order type
    const normalizedOrder = normalizeOrder(orderFound[0]);

    //extracting tasks that are not assigned to the current user (only if user is a technician)
    if (userRoleName === 'technician') {
      normalizedOrder.tasks = normalizedOrder.tasks.filter(
        (task) => task.technicianId === payload.sub,
      );
    }

    const orderWithUser = (
      await this.orderService.getOrdersWithTechnicians([normalizedOrder])
    )[0];

    return { order: orderFound, normalizedOrder: orderWithUser };
  }

  @Post(':id/finish')
  @Permissions(Permission.FinishOrders)
  async finishOrder(
    @Param('id') id: string,
    @Request() req,
  ) /* : Promise<Order> */ {
    const UID = await authenticateFromOdoo();
    const normalizedOrder = await this.getOrderById(id, req);
    const orderFound = normalizedOrder.order;

    if (!orderFound) throw new NotFoundException('Order not found');

    //Removing user assignment from order
    await updateOdooOrder(UID, +id, 'x_studio_technicians_assigned', '');

    //Removing designer assignment from order
    await updateOdooOrder(UID, +id, 'x_studio_designers_assigned', '');

    //Completing all uncompleted tasks
    const tasks = normalizedOrder.normalizedOrder.tasks;
    for (const task of tasks) {
      if (task.status === 'IN-PROGRESS') {
        await this.finishTask(id, task.id);
      }
    }

    //Changing order status
    await updateOdooOrder(UID, +id, 'stage_id', 5);
  }

  @Post(':orderId/finishTask/:taskId')
  @Permissions(Permission.FinishTasks)
  async finishTask(
    @Param('orderId') orderId: string,
    @Param('taskId') taskId: string,
  ): Promise<Task> {
    const UID = await authenticateFromOdoo();

    //Founding order
    const orderFound = await getOdooOrderById(UID, +orderId);
    if (!orderFound) throw new NotFoundException('Order not found');

    //Founding task
    const normalizedOrder = normalizeOrder(orderFound[0]);
    const tasks = normalizedOrder.tasks;
    const taskFound = tasks.find((task) => task.id === taskId);
    if (!taskFound) throw new NotFoundException('Task not found');

    //Completing task
    taskFound.status = 'COMPLETED';
    //Defining task finished date
    taskFound.dateFinished = new Date();

    //Removing technician assignment from task if there is not any other uncompleted task assigned to the same designer
    if (taskFound.technicianId) {
      const technicianId = taskFound.technicianId;
      const uncompletedTasks = tasks.filter(
        (task) =>
          task.status !== 'COMPLETED' && task.technicianId === technicianId,
      );

      if (uncompletedTasks.length === 0) {
        //Getting previous techinicians assigned
        const techiniciansAssignedIds = normalizedOrder.techniciansAssignedId;
        const updetedTechiniciansAssignedIds = techiniciansAssignedIds.filter(
          (id) => id !== taskFound.technicianId,
        );
        //Removing user assignment from order
        await updateOdooOrder(
          UID,
          +orderId,
          'x_studio_technicians_assigned',
          updetedTechiniciansAssignedIds,
        );
      }
    }

    //Stringify task
    const updatedTasks = JSON.stringify(tasks);

    //Updating task
    await updateOdooOrder(UID, +orderId, 'x_studio_tasks', updatedTasks);

    return taskFound;
  }

  @Patch(':orderId/editTask/:taskId')
  @Permissions(Permission.EditTasks)
  async editTask(
    @Param('orderId') orderId: string,
    @Param('taskId') taskId: string,
    @Body() data: EditTaskDto,
  ): Promise<Task> {
    const UID = await authenticateFromOdoo();

    //Founding order
    const orderFound = await getOdooOrderById(UID, +orderId);
    if (!orderFound) throw new NotFoundException('Order not found');

    //Founding task
    const normalizedOrder = normalizeOrder(orderFound[0]);
    const tasks = normalizedOrder.tasks;
    const taskFound = tasks.find((task) => task.id === taskId);
    if (!taskFound) throw new NotFoundException('Task not found');

    //Editing task
    const updatedTask = { ...taskFound, ...data };
    updatedTask.updatedAt = new Date();

    //Updating and mapping older tasks
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? updatedTask : task,
    );

    //Removing technician assignment from task if there is not any other uncompleted task assigned to the same technician
    if (data.technicianId) {
      const technicianId = data.technicianId;
      const uncompletedTasks = updatedTasks.filter(
        (task) =>
          task.status !== 'COMPLETED' && task.technicianId === technicianId,
      );

      if (uncompletedTasks.length === 0) {
        //Getting previous techinicians assigned
        const techiniciansAssignedIds = normalizedOrder.techniciansAssignedId;
        const updetedTechiniciansAssignedIds = techiniciansAssignedIds.filter(
          (id) => id !== data.technicianId,
        );
        //Removing user assignment from order
        await updateOdooOrder(
          UID,
          +orderId,
          'x_studio_technicians_assigned',
          updetedTechiniciansAssignedIds,
        );
      }
    }
    //Stringify task
    const stringifiedUpdatedTasks = JSON.stringify(updatedTasks);

    //Updating task in Odoo
    await updateOdooOrder(
      UID,
      +orderId,
      'x_studio_tasks',
      stringifiedUpdatedTasks,
    );

    return updatedTask;
  }

  @Delete(':orderId/cancelTask/:taskId')
  @Permissions(Permission.CancelTasks)
  async CancelTask(
    @Param('orderId') orderId: string,
    @Param('taskId') taskId: string,
    @Body() data: EditTaskDto,
  ): Promise<Task> {
    const UID = await authenticateFromOdoo();

    //Founding order
    const orderFound = await getOdooOrderById(UID, +orderId);
    if (!orderFound) throw new NotFoundException('Order not found');

    //Founding task
    const normalizedOrder = normalizeOrder(orderFound[0]);
    const tasks = normalizedOrder.tasks;
    const taskFound = tasks.find((task) => task.id === taskId);
    if (!taskFound) throw new NotFoundException('Task not found');

    //Editing task
    taskFound.status = 'CANCELLED';
    taskFound.updatedAt = new Date();

    //Removing technician assignment from task if there is not any other uncompleted task assigned to the same designer
    if (taskFound.technicianId) {
      const technicianId = taskFound.technicianId;
      const uncompletedTasks = tasks.filter(
        (task) =>
          task.status === 'IN-PROGRESS' && task.technicianId === technicianId,
      );

      if (uncompletedTasks.length === 0) {
        //Getting previous techinicians assigned
        const techiniciansAssignedIds = normalizedOrder.techniciansAssignedId;
        const updetedTechiniciansAssignedIds = techiniciansAssignedIds.filter(
          (id) => id !== taskFound.technicianId,
        );
        //Removing user assignment from order
        await updateOdooOrder(
          UID,
          +orderId,
          'x_studio_technicians_assigned',
          updetedTechiniciansAssignedIds,
        );
      }
    }

    //Stringify task
    const stringifiedUpdatedTasks = JSON.stringify(tasks);

    //Updating task in Odoo
    await updateOdooOrder(
      UID,
      +orderId,
      'x_studio_tasks',
      stringifiedUpdatedTasks,
    );

    return taskFound;
  }

  @Post()
  @Permissions(Permission.CreateOrders)
  async createOrder(@Body() data: CreateOrderDto) /* : Promise<Order> */ {
    /* //checking if user exists
    const user = await this.usersService.getUserById(data.userId);
    if (!user) throw new BadRequestException('User not found');

    return this.orderService.createOrder(data); */
  }

  @Post('assignDesigner')
  @Permissions(Permission.AssignDesigner)
  async assignDesigner(
    @Request() req,
    @Body() data: AssignDesignerDto,
  ): Promise<void> {
    try {
      //checking if order exists
      const order = await this.getOrderById(data.orderId.toString(), req);
      if (!order) throw new BadRequestException('Order not found');

      //checking if user exists
      const user = await this.usersService.getUserById(data.designerId);
      if (!user) throw new BadRequestException('Designer not found');

      //Authenticating Odoo
      const uid = await authenticateFromOdoo();

      //Changing order status to Propousal
      await updateOdooOrder(uid, data.orderId, 'stage_id', 9);

      //Getting previous designers assigned
      const designerAssignedIds = order.normalizedOrder.designersAssignedIds;

      //Removing duplicates
      const uniqueDesignerAssignedIds = new Set(designerAssignedIds);

      //Adding designer
      uniqueDesignerAssignedIds.add(data.designerId);

      const parsedDesignerAssignedIds = JSON.stringify([
        ...uniqueDesignerAssignedIds,
      ]);

      //Assigning designer
      await updateOdooOrder(
        uid,
        data.orderId,
        'x_studio_designers_assigned',
        parsedDesignerAssignedIds,
      );

      //Adding commentx
      data.comment &&
        (await updateOdooOrder(
          uid,
          data.orderId,
          'x_studio_comment',
          data.comment,
        ));
    } catch (err) {
      console.error({ err });
      throw new NotFoundException("Order doesn't exist");
    }
  }

  @Post('assignTechnician')
  @Permissions(Permission.AssignTechnician)
  async assignTechnician(
    @Request() req,
    @Body() data: AssignUserDto,
  ): Promise<Task> {
    try {
      //checking if user exists
      const user = await this.usersService.getUserById(data.technicianId);
      if (!user) throw new BadRequestException('Technician not found');

      //Authenticating Odoo
      const uid = await authenticateFromOdoo();

      //Changing order status to Production
      await updateOdooOrder(uid, data.orderId, 'stage_id', 10);

      //Getting previous technicians assigned
      const order = await this.getOrderById(data.orderId.toString(), req);
      const userAssignedIds = order.normalizedOrder.techniciansAssignedId;

      //Removing duplicates
      const uniqueUserAssignedIds = new Set(userAssignedIds);

      //Adding new user
      uniqueUserAssignedIds.add(data.technicianId);

      //Stringify users as array
      const parsedUserAssignedIds = JSON.stringify([...uniqueUserAssignedIds]);

      //Assigning user in odoo
      await updateOdooOrder(
        uid,
        data.orderId,
        'x_studio_technicians_assigned',
        parsedUserAssignedIds,
      );

      //Getting previous tasks
      const tasks = (await this.getOrderById(data.orderId.toString(), req))
        .normalizedOrder.tasks;

      //Creating new task
      const newTask: Task = {
        id: randomUUID(),
        technicianId: data.technicianId,
        dateAssigned: new Date(),
        instructions: data.instructions,
        status: 'IN-PROGRESS',
      };

      //Adding new task to previous tasks
      tasks.push(newTask);

      //Stringify tasks
      const parsedTasks = JSON.stringify(tasks);

      //Updating odoo tasks
      await updateOdooOrder(uid, data.orderId, 'x_studio_tasks', parsedTasks);

      return newTask;
    } catch (err) {
      console.error({ err });
      throw new NotFoundException(err);
    }
  }

  @Patch(':id')
  @Permissions(Permission.UpdateOrders)
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
  @Permissions(Permission.DeleteOrders)
  async deleteOrder(@Param('id') id: string) /* : Promise<Order> */ {
    /* try {
      return await this.orderService.deleteOrder(Number(id));
    } catch (err) {
      throw new NotFoundException("Order doesn't exist");
    } */
  }

  @Post(':orderId/createDirectory')
  async createDirectory(@Request() req, @Param('orderId') orderId: string) {
    const order = await this.getOrderById(orderId, req);
    const BASE_DIR = settings.BASE_ROOT_DIRECTORY;
    const currentYear = new Date().getFullYear().toString();
    const orderName = order.normalizedOrder.name;
    const companyName = order.normalizedOrder.companyName || orderName;
    const ORDER_PATH = path.join(
      BASE_DIR,
      sanitizePathName(companyName),
      currentYear,
      sanitizePathName(orderName),
    );

    try {
      for (const folder of settings.FOLDERS_STRUCTURE) {
        await createFolders(path.join(ORDER_PATH, folder));
      }
      const uid = await authenticateFromOdoo();
      await updateOdooOrder(uid, +orderId, 'x_studio_directory', ORDER_PATH);

      return ORDER_PATH;
    } catch (err) {
      console.error({ err });
      throw new ServiceUnavailableException('Could not create directory');
    }
  }
}
