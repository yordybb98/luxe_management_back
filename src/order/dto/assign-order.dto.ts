import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class AssignUserDto {
  @IsString()
  instructions: string;

  @IsNumber()
  technicianId: number;

  @IsNumber()
  orderId: number;
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
