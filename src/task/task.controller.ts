import {
  Controller,
  ForbiddenException,
  Get,
  NotImplementedException,
  Query,
  Request,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task } from 'src/common/types/tasks';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { Order } from 'src/common/types/order';
import { TaskStatusEnum } from './dto/task.dto';

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
  @ApiQuery({
    name: 'status',
    enum: TaskStatusEnum,
    required: false,
    description: 'Task status filter',
  })
  async myTasks(
    @Request() req,
    @Query('status') status: TaskStatusEnum,
  ): Promise<Task[]> {
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
}
