import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ConflictException,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ApiTags } from '@nestjs/swagger';
import { Permission } from '@prisma/client';
import { Permissions } from 'src/common/decorators/permissions.decorators';
import { Public } from 'src/common/guards/public.guard';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @Permissions(Permission.CreateRoles)
  createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Get()
  @Permissions(Permission.ViewRoles)
  getAllRoles() {
    return this.roleService.getAllRoles();
  }

  @Get(':id')
  @Permissions(Permission.ViewRoles)
  getRoleById(@Param('id') id: string) {
    return this.roleService.getRoleById(+id);
  }

  @Patch(':id')
  @Permissions(Permission.UpdateRoles)
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.updateRole(+id, updateRoleDto);
  }

  @Delete(':id')
  @Permissions(Permission.DeleteRoles)
  async removeRole(@Param('id') id: string) {
    try {
      return await this.roleService.removeRole(+id);
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }
}
