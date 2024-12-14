import { Injectable } from '@nestjs/common';
import { Notification } from 'src/common/types/notification';
import { NotificationGateway } from 'src/gateway/gateway';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationGateway: NotificationGateway,
    private readonly userService: UserService,
  ) {}

  async notifyUser(userId: number, content: Notification): Promise<void> {
    // Example: Send a notification to a specific user
    this.notificationGateway.sendMessageToUser(userId, {
      msg: 'New notification',
      content,
    });
  }

  async notifyAllAdmins(content: Notification): Promise<void> {
    //Fetching all admins
    const admins = await this.userService.getAllAdmins();

    console.log({ admins });
    //Send a notification to all admins
    admins.forEach((admin) => {
      this.notificationGateway.sendMessageToUser(admin.id, {
        msg: 'New notification',
        content,
      });
    });
  }

  async broadcast(content: any): Promise<void> {
    // Example: Broadcast to all connected users
    this.notificationGateway.broadcastMessage({
      msg: 'Broadcast message',
      content,
    });
  }
}
