import { Injectable } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatusService {
  constructor(private readonly prisma: PrismaService) {}

  async createStatus(data: CreateStatusDto) {
    return await this.prisma.status.create({ data });
  }

  async getAllStatus() {
    return await this.prisma.status.findMany();
  }

  async getStatusById(id: number) {
    return await this.prisma.status.findUnique({ where: { id } });
  }

  async updateStatus(id: number, updateStatusDto: UpdateStatusDto) {
    return await this.prisma.status.update({
      where: { id },
      data: updateStatusDto,
    });
  }

  async deleteStatus(id: number) {
    return await this.prisma.status.delete({ where: { id } });
  }
}
