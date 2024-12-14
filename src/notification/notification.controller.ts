import { Controller, Get, Param, Post, Put, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/guards/public.guard';
import { NotificationService } from 'src/notification/notification.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('')
  async getAllNotifications() {
    return await this.notificationService.getAllNotifications();
  }

  @Post(':id')
  async readAllNotifications(@Request() req) {
    const userId = req.user.id;
    return await this.notificationService.readAllNotificationsByUser(userId);
  }

  @Get(':id')
  async getNotification(@Param('id') id: string) {
    return await this.notificationService.getNotification(+id);
  }

  @Put(':id')
  async readNotification(@Param('id') id: string) {
    return await this.notificationService.readNotification(+id);
  }

  @Get('user/:id')
  async getAllNotificationsByUser(@Param('id') id: string) {
    const notifications =
      await this.notificationService.getAllNotificationsByUser(+id);
    return notifications;
  }
}
