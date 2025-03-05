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

@Injectable()
export class TaskService {
  constructor(private readonly orderService: OrderService) {}

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
  }: {
    userLoggedIn: PayloadToken;
  }): Promise<TaskWithOrder[]> {
    if (userLoggedIn.role.permissions.includes(Permission.ViewMyTasks)) {
      const tasks: TaskWithOrder[] = [];

      const { myOrders, total } = await this.orderService.getMyOrders({
        userLoggedIn,
        withoutPagination: true,
      });

      if (total > 0) {
        myOrders.forEach((order) => {
          const tasksWithOrderId = order.tasks.map((task) => ({
            ...task,
            orderId: order.id, // ✅ Include order ID dynamically
          }));

          tasks.push(...tasksWithOrderId);
        });
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
  }): Promise<Order> {
    const { normalizedOrder: order } = await this.orderService.getOrderById({
      id: orderId,
      userLoggedIn,
    });

    if (order) {
      return order;
      /* const task = order.tasks.find((task) => task.id === taskId);
      if (!task) throw new NotFoundException('Task not found');
      return {
        ...task,
        orderId: order.id,
      }; */
    } else {
      throw new NotFoundException('Order not found');
    }
  }
}
