import { Injectable } from '@nestjs/common';
import { Notification, NotificationType } from '@prisma/client';
import { NotificationGateway } from 'src/gateway/gateway';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationGateway: NotificationGateway,
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
  ) {}

  async notifyUser(
    userId: number,
    content: { message: string; type: NotificationType },
  ): Promise<void> {
    const notification: Omit<Notification, 'id'> = {
      timestamp: new Date(),
      type: content.type,
      userId,
      message: content.message,
      readed: false,
      source: 'user',
    };

    const newNotification = await this.saveNotification(notification);
    console.log('Notification saved');

    console.log('Notifying user');
    this.notificationGateway.sendMessageToUser(userId, {
      msg: 'New notification',
      content: newNotification,
    });
    console.log('Notification sent');
  }

  async notifyAllAdmins(content: {
    message: string;
    type: NotificationType;
  }): Promise<void> {
    //Fetching all admins
    console.log('Notifying all admins');
    const admins = await this.userService.getAllAdmins();

    //Send a notification to all admins
    for (const admin of admins) {
      const notification: Omit<Notification, 'id'> = {
        timestamp: new Date(),
        type: content.type,
        userId: admin.id,
        message: content.message,
        readed: false,
        source: 'user',
      };

      const newNotification = await this.saveNotification(notification);
      console.log('Notification saved for admin', admin.username);

      this.notificationGateway.sendMessageToUser(admin.id, {
        msg: 'New notification',
        content: newNotification,
      });
    }

    console.log('Notifications sent and saved');
  }

  async saveNotification(
    notification: Omit<Notification, 'id'>,
  ): Promise<Notification> {
    return await this.prismaService.notification.create({
      data: {
        userId: notification.userId,
        message: notification.message,
        readed: notification.readed || false,
        source: notification.source,
        type: notification.type,
        timestamp: new Date(),
      },
    });
  }

  async broadcast(content: any): Promise<void> {
    // Example: Broadcast to all connected users
    this.notificationGateway.broadcastMessage({
      msg: 'Broadcast message',
      content,
    });
  }

  async getAllNotifications(): Promise<Notification[]> {
    return await this.prismaService.notification.findMany({
      orderBy: { timestamp: 'desc' },
    });
  }

  async getAllNotificationsByUser(userId: number): Promise<Notification[]> {
    return await this.prismaService.notification.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    });
  }

  async getNotification(notificationId: number): Promise<Notification> {
    return await this.prismaService.notification.findUniqueOrThrow({
      where: { id: notificationId },
    });
  }

  async readNotification(notificationId: number): Promise<Notification> {
    return await this.prismaService.notification.update({
      where: { id: notificationId },
      data: { readed: true },
    });
  }

  async readAllNotificationsByUser(userId: number): Promise<void> {
    await this.prismaService.notification.updateMany({
      where: { userId: userId, readed: false },
      data: { readed: true },
    });
  }
}
