import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('projects')
@ApiTags('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.createProject(createProjectDto);
  }

  @Get()
  getAllProjects() {
    return this.projectService.getAllProjects();
  }

  @Get(':id')
  getProjectById(@Param('id') id: string) {
    return this.projectService.getProjectById(+id);
  }

  @Patch(':id')
  updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.updateProject(+id, updateProjectDto);
  }

  @Delete(':id')
  deleteProject(@Param('id') id: string) {
    return this.projectService.deleteProject(+id);
  }
}
