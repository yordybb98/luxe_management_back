import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { Permission } from '@prisma/client';
import { Order } from 'src/common/types/order';
import { PayloadToken } from 'src/common/types/payload';
import { Task, TaskWithOrder } from 'src/common/types/tasks';
import { OrderService } from 'src/order/order.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TaskService {
  constructor(
    private readonly orderService: OrderService,
    private readonly usersService: UserService,
  ) {}

  async getAllTasks({
    userLoggedIn,
  }: {
    userLoggedIn: PayloadToken;
  }): Promise<Order[]> {
    throw new NotImplementedException();
    /* if (userLoggedIn.role.permissions.includes(Permission.ViewAllTasks)) {
      try {
        const orders = await this.orderService.getAllOrders({ userLoggedIn });
        const tasks: Task[] = [];
        orders.allOrders.map((order) => {
          tasks.push(...order.tasks);
        });
        return orders.allOrders;
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    } else {
      throw new ForbiddenException(
        'You do not have permission to view all tasks.',
      );
    } */
  }

  async getMyTasks({
    userLoggedIn,
    order,
  }: {
    userLoggedIn: PayloadToken;
    order?: string;
  }): Promise<TaskWithOrder[]> {
    if (userLoggedIn.role.permissions.includes(Permission.ViewMyTasks)) {
      const tasks: TaskWithOrder[] = [];

      const { myOrders, total } = await this.orderService.getMyOrders({
        userLoggedIn,
        withoutPagination: true,
        order,
      });

      if (total > 0) {
        for (const order of myOrders) {
          const tasksWithOrderId = await Promise.all(
            order.tasks.map(async (task) => {
              if (task.assignedBy && !task.assignerName) {
                const assigner = await this.usersService.getUserById(
                  task.assignedBy,
                );
                task.assignerName = assigner?.name ?? '-';
              }

              return {
                ...task,
                clientName: order.companyName,
                orderId: order.id,
                orderDeadline: order.deadline,
              };
            }),
          );

          tasks.push(...tasksWithOrderId);
        }
      }

      return tasks;
    } else {
      throw new ForbiddenException(
        'You do not have permission to view your tasks.',
      );
    }
  }

  async getTaskByOrderId({
    orderId,
    taskId,
    userLoggedIn,
  }: {
    orderId: string;
    taskId: string;
    userLoggedIn: PayloadToken;
  }): /* Promise<Order> */ Promise<TaskWithOrder> {
    const { normalizedOrder: order } = await this.orderService.getOrderById({
      id: orderId,
      userLoggedIn,
    });

    if (order) {
      const task = order.tasks.find((task) => task.id === taskId);
      if (!task) throw new NotFoundException('Task not found');
      return {
        ...task,
        orderId: order.id,
        clientName: order.companyName,
        orderDirectory: order.directory,
        orderImages: order.images,
        orderDeadline: order.deadline,
      };
    } else {
      throw new NotFoundException('Order not found');
    }
  }
}
