import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async createPermission(data: CreatePermissionDto) {
    return await this.prisma.permission.create({ data });
  }

  async getAllPermissions() {
    return await this.prisma.permission.findMany();
  }

  async getPermissionById(id: number) {
    return await this.prisma.permission.findUnique({ where: { id } });
  }

  async updatePermission(id: number, updatePermissionDto: UpdatePermissionDto) {
    return await this.prisma.permission.update({
      where: { id },
      data: updatePermissionDto,
    });
  }

  async deletePermission(id: number) {
    return await this.prisma.permission.delete({ where: { id } });
  }
}
