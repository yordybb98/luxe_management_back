import { PartialType } from '@nestjs/swagger';
import { AssignTaskDto } from './assign-order.dto';

export class EditTaskDto extends PartialType(AssignTaskDto) {}
