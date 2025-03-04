import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Permission } from '@prisma/client';
import { Order } from 'src/common/types/order';
import { PayloadToken } from 'src/common/types/payload';
import { Task } from 'src/common/types/tasks';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class TaskService {
  constructor(private readonly orderService: OrderService) {}

  async getAllTasks({
    userLoggedIn,
  }: {
    userLoggedIn: PayloadToken;
  }): Promise<Order[]> {
    if (userLoggedIn.role.permissions.includes(Permission.ViewAllTasks)) {
      try {
        const orders = await this.orderService.getAllOrders({ userLoggedIn });
        const tasks: Task[] = [];
        console.log({ orders });
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
    }
  }

  async getMyTasks({
    userLoggedIn,
  }: {
    userLoggedIn: PayloadToken;
  }): Promise<Task[]> {
    if (userLoggedIn.role.permissions.includes(Permission.ViewMyTasks)) {
      const tasks: Task[] = [];

      const { myOrders, total } = await this.orderService.getMyOrders({
        userLoggedIn,
        withoutPagination: true,
      });

      if (total > 0) {
        myOrders.map((order) => {
          tasks.push(...order.tasks);
        });
      }

      return tasks;
    } else {
      throw new ForbiddenException(
        'You do not have permission to view your tasks.',
      );
    }
  }
}
