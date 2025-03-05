import {
  Controller,
  ForbiddenException,
  Get,
  NotImplementedException,
  Param,
  Query,
  Request,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task, TaskWithOrder } from 'src/common/types/tasks';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { Order } from 'src/common/types/order';
import { TaskStatusEnum } from './dto/task.dto';
import { Permissions } from 'src/common/decorators/permissions.decorators';
import { Permission, UserType } from '@prisma/client';

@Controller('task')
@ApiTags('Task')
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private authService: AuthService,
  ) {}

  @Get('alltasks')
  @ApiBearerAuth()
  async alltasks(@Request() req): Promise<Order[]> {
    throw new NotImplementedException();
    try {
      const userLoggedIn = await this.authService.getUserLoggedIn(req);
      return await this.taskService.getAllTasks({ userLoggedIn });
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  @Get('my-tasks')
  @ApiBearerAuth()
  @Permissions(Permission.ViewMyTasks)
  @ApiQuery({
    name: 'status',
    enum: TaskStatusEnum,
    required: false,
    description: 'Task status filter',
  })
  async myTasks(
    @Request() req,
    @Query('status') status: TaskStatusEnum,
  ): Promise<TaskWithOrder[]> {
    try {
      const userLoggedIn = await this.authService.getUserLoggedIn(req);
      const myTasks = await this.taskService.getMyTasks({ userLoggedIn });
      if (status === TaskStatusEnum.COMPLETED) {
        const completedTasks = myTasks.filter(
          (task) => task.status === 'COMPLETED',
        );

        return completedTasks;
      } else if (status === TaskStatusEnum.IN_PROGRESS) {
        const pendingTasks = myTasks.filter(
          (task) => task.status !== 'COMPLETED' && task.status !== 'ON HOLD',
        );

        return pendingTasks;
      } else if (status === TaskStatusEnum.ON_HOLD) {
        const pendingTasks = myTasks.filter(
          (task) => task.status === 'ON HOLD',
        );

        return pendingTasks;
      } else if (status === TaskStatusEnum.CANCELLED) {
        const cancelledTasks = myTasks.filter(
          (task) => task.status === 'CANCELLED',
        );
        return cancelledTasks;
      } else {
        return myTasks;
      }
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }

  @Get(':orderId/:taskId')
  @Permissions(Permission.ViewMyTasks)
  @ApiBearerAuth()
  async getTaskByOrderId(
    @Request() req,
    @Param('orderId') orderId: string,
    @Param('taskId') taskId: string,
  ) {
    try {
      const userLoggedIn = await this.authService.getUserLoggedIn(req);

      if (userLoggedIn.userType !== UserType.TECHNICIAN)
        throw new ForbiddenException(
          'You must be a technician to access this route',
        );
      const result = await this.taskService.getTaskByOrderId({
        userLoggedIn,
        orderId,
        taskId,
      });

      return result;
    } catch (error) {
      throw new ForbiddenException(error.message);
    }
  }
}
