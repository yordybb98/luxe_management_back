import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/createUserDto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        department: true,
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
        department: true,
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
        department: true,
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
          department: {
            connect: { id: data.departmentId },
          },
          role: {
            connect: { id: data.roleId },
          },
          permissions: {
            connect: data.permissions.map((id) => ({ id })),
          },
        },
        include: {
          department: true,
          role: true,
          permissions: true,
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
}
