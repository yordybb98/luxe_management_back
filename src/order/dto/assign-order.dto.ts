import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class AssignTaskDto {
  @IsString()
  instructions: string;

  @IsNumber()
  technicianId: number;

  @IsNumber()
  orderId: number;

  @IsString()
  name: string;
}

export class AssignDesignerDto {
  @IsNumber()
  designerId: number;

  @IsNumber()
  orderId: number;

  @IsOptional()
  comment?: string;
}

export class EditDesignerAssigmentDto {
  @IsArray()
  @IsNumber({}, { each: true })
  designerIds: number[];

  @IsNumber()
  orderId: number;
}

export class AssignSubtaskDto {
  @IsString()
  instructions: string;

  @IsNumber()
  technicianId: number;

  @IsString()
  name: string;

  @IsNumber()
  orderId: number;

  @IsString()
  parentTaskId: string;
}
