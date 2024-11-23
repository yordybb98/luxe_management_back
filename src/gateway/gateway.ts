import { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { jwtConstants } from 'src/auth/constants';
import { PayloadToken } from 'src/common/types/payload';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4000'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class NotificationGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    // private readonly prisma: PrismaService,
  ) {}
  private activeUsers = new Map<number, Socket>();

  onModuleInit() {
    this.server.on('connection', async (socket: Socket) => {
      // Extract and validate the user ID from query parameters or headers
      const token = socket.handshake.headers['authorization'];
      if (!token) {
        console.log('No token provided');
        socket.disconnect(); // Reject connection if no userId
        return;
      }

      try {
        const payload: PayloadToken = await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret,
        });

        console.log(
          `User connected: ${payload.email} (Socket ID: ${socket.id})`,
        );

        // Store the connection
        this.activeUsers.set(payload.sub, socket);

        //this.sendPendingNotifications(payload.sub);

        // Handle disconnection
        socket.on('disconnect', () => {
          console.log(`User disconnected: ${payload.email}`);
          this.activeUsers.delete(payload.sub);
        });
      } catch (error) {
        socket.disconnect(); // Reject connection if no userId
        return;
      }
    });
  }

  sendMessageToUser(userId: number, message: any): void {
    console.log(this.activeUsers.size);
    const targetSocket = this.activeUsers.get(userId);
    if (targetSocket) {
      targetSocket.emit('onMessage', message);
    } else {
      console.log(`User ${userId} is not connected.`);
    }
    // this.saveNotification(userId, message);
  }

  broadcastMessage(message: any): void {
    this.server.emit('onMessage', message);
  }

  /* private async sendPendingNotifications(userId: number): Promise<void> {
    const pendingNotifications = await this.prisma.notification.findMany({
      where: {
        userId,
        delivered: false,
      },
    });

    const targetSocket = this.activeUsers.get(userId);

    if (targetSocket) {
      for (const notification of pendingNotifications) {
        targetSocket.emit('onMessage', notification.message);

        await this.prisma.notification.update({
          where: { id: notification.id },
          data: { delivered: true },
        });
      }
    }
  } */

  /* private async saveNotification(userId: number, message: any): Promise<void> {
    await this.prisma.notification.create({
      data: {
        userId,
        message,
      },
    });
    console.log(`Notification saved for user ${userId}`);
  } */
}
