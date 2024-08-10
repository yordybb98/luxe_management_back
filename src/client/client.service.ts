import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  async createClient(data: CreateClientDto) {
    return await this.prisma.client.create({ data });
  }

  async getAllClients() {
    return await this.prisma.client.findMany();
  }

  async getClientById(id: number) {
    return await this.prisma.client.findUnique({ where: { id } });
  }

  async updateClient(id: number, data: UpdateClientDto) {
    return await this.prisma.client.update({ where: { id }, data });
  }

  async deleteClient(id: number) {
    return await this.prisma.client.delete({ where: { id } });
  }
}
