import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { ApiTags } from '@nestjs/swagger';
import { Permissions } from 'src/common/decorators/permissions.decorators';

@Controller('department')
@ApiTags('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  @Permissions('CreateDepartments')
  createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.createDepartment(createDepartmentDto);
  }

  @Get()
  @Permissions('ViewDepartments')
  getAllDepartments() {
    return this.departmentService.getAllDepartments();
  }

  @Get(':id')
  @Permissions('ViewDepartments')
  getDepartmentById(@Param('id') id: string) {
    return this.departmentService.getDepartmentById(+id);
  }

  @Patch(':id')
  @Permissions('UpdateDepartments')
  updateDepartment(
    @Param('id') id: string,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    return this.departmentService.updateDepartment(+id, updateDepartmentDto);
  }

  @Delete(':id')
  @Permissions('DeleteDepartments')
  removeDepartment(@Param('id') id: string) {
    return this.departmentService.removeDepartment(+id);
  }
}
