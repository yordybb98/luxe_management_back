import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUserDto';
import { UserResponseDto } from './dto/getAllUsersResponseDto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.prisma.user.findMany({
      include: {
        role: true,
      },
    });
  }

  async getUserById(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        role: true,
      },
    });
  }

  async getUserByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        role: true,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async createUser(data: CreateUserDto) {
    try {
      const newUser = await this.prisma.user.create({
        data: {
          name: data.name,
          username: data.username,
          email: data.email,
          password: data.password,
          ...(data.departmentId && {
            department: {
              connect: { id: data.departmentId },
            },
          }),
          role: {
            connect: { id: data.roleId },
          },
        },
        include: {
          role: true,
        },
      });

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  async updateUser(id: number, data: User): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async assignOrder(userId: number, orderId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { orders: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const { orders } = user;

    // Verifica si el orderId ya está en la lista
    const updatedOrders = [...new Set([...orders, orderId])];

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        orders: updatedOrders,
      },
    });
  }
}
