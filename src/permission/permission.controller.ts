import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('permission')
@ApiTags('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionService.createPermission(createPermissionDto);
  }

  @Get()
  getAllPermissions() {
    return this.permissionService.getAllPermissions();
  }

  @Get(':id')
  getPermissionById(@Param('id') id: string) {
    return this.permissionService.getPermissionById(+id);
  }

  @Patch(':id')
  updatePermission(@Param('id') id: string, @Body() data: UpdatePermissionDto) {
    return this.permissionService.updatePermission(+id, data);
  }

  @Delete(':id')
  deletePermission(@Param('id') id: string) {
    return this.permissionService.deletePermission(+id);
  }
}
