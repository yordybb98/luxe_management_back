import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(data: CreateProjectDto) {
    const clientExists = await this.prisma.client.findUnique({
      where: {
        id: data.clientId,
      },
    });
    if (!clientExists) {
      throw new BadRequestException('Client not found');
    }

    return await this.prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        client: {
          connect: {
            id: data.clientId,
          },
        },
      },
      include: {
        client: true,
      },
    });
  }

  async getAllProjects() {
    return await this.prisma.project.findMany({
      include: {
        client: true,
      },
    });
  }

  async getProjectById(id: number) {
    return await this.prisma.project.findUnique({
      where: { id },
      include: { client: true },
    });
  }

  async updateProject(id: number, data: UpdateProjectDto) {
    return await this.prisma.project.update({
      where: { id },
      data,
    });
  }

  async deleteProject(id: number) {
    return await this.prisma.project.delete({ where: { id } });
  }
}
