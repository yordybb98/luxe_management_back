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
    const { haveUsers, totalUsers } = await this.haveUsers(id);
    if (haveUsers)
      throw new Error(
        `This role cannot be deleted because it has ${totalUsers} users`,
      );
    else return await this.prisma.role.delete({ where: { id } });
  }

  async haveUsers(
    id: number,
  ): Promise<{ haveUsers: boolean; totalUsers: number }> {
    const role = await this.prisma.role.findUnique({
      where: { id },
      select: {
        _count: { select: { users: true } },
      },
    });

    const totalUsers = role?._count?.users;

    return { haveUsers: totalUsers > 0, totalUsers };
  }
}
