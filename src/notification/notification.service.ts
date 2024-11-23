import { Injectable } from '@nestjs/common';
import { NotificationGateway } from 'src/gateway/gateway';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationGateway: NotificationGateway) {}

  async notifyUser(userId: number, content: any): Promise<void> {
    // Example: Send a notification to a specific user
    this.notificationGateway.sendMessageToUser(userId, {
      msg: 'New notification',
      content,
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
