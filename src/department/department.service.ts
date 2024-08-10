import { Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Department } from '@prisma/client';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async createDepartment(data: CreateDepartmentDto) {
    return await this.prisma.department.create({ data });
  }

  async getAllDepartments(): Promise<Department[]> {
    return this.prisma.department.findMany();
  }

  async getDepartmentById(id: number) {
    return this.prisma.department.findUnique({ where: { id } });
  }

  async updateDepartment(id: number, data: UpdateDepartmentDto) {
    return await this.prisma.department.update({
      where: { id },
      data,
    });
  }

  async removeDepartment(id: number) {
    return await this.prisma.department.delete({ where: { id } });
  }
}
