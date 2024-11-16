import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskStatus } from 'src/common/types/tasks';

export class QueryParamsDto {
  @IsEnum(['IN-PROGRESS', 'COMPLETED', 'CANCELLED', 'ON HOLD'], {
    message:
      'Invalid status. Allowed values: IN-PROGRESS, COMPLETED, CANCELLED, ON HOLD',
  })
  @Transform(({ value }) => value.trim())
  @IsOptional()
  status: TaskStatus;
}
