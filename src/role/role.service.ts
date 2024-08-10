import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async createRole(data: CreateRoleDto) {
    return this.prisma.role.create({ data });
  }

  async getAllRoles(): Promise<Role[]> {
    return await this.prisma.role.findMany();
  }

  async getRoleById(id: number) {
    return await this.prisma.role.findUnique({ where: { id } });
  }

  async updateRole(id: number, data: UpdateRoleDto) {
    return await this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async removeRole(id: number) {
    return await this.prisma.role.delete({ where: { id } });
  }
}
