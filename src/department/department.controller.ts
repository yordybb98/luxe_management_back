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
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Permissions } from 'src/common/decorators/permissions.decorators';

@Controller('department')
@ApiTags('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  createDepartment(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.createDepartment(createDepartmentDto);
  }

  @Get()
  @UseGuards(PermissionGuard)
  @Permissions('ViewDepartments')
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
