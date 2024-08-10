import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('department')
@ApiTags('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.createDepartment(createDepartmentDto);
  }

  @Get()
  getAllDepartments() {
    return this.departmentService.getAllDepartments();
  }

  @Get(':id')
  getDepartmentById(@Param('id') id: string) {
    return this.departmentService.getDepartmentById(+id);
  }

  @Patch(':id')
  updateDepartment(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.updateDepartment(+id, updateDepartmentDto);
  }

  @Delete(':id')
  removeDepartment(@Param('id') id: string) {
    return this.departmentService.removeDepartment(+id);
  }
}
