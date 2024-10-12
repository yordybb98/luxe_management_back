import { PartialType } from '@nestjs/swagger';
import { AssignUserDto } from './assign-order.dto';

export class EditTaskDto extends PartialType(AssignUserDto) {}
