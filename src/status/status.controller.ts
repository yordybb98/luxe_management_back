import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  createStatus(@Body() data: CreateStatusDto) {
    return this.statusService.createStatus(data);
  }

  @Get()
  getAllStatus() {
    return this.statusService.getAllStatus();
  }

  @Get(':id')
  getStatusById(@Param('id') id: string) {
    return this.statusService.getStatusById(+id);
  }

  @Patch(':id')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.statusService.updateStatus(+id, updateStatusDto);
  }

  @Delete(':id')
  deleteStatus(@Param('id') id: string) {
    return this.statusService.deleteStatus(+id);
  }
}
