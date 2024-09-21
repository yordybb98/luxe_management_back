import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AssignUserDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  orderId: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class AssignDesignerDto {
  @IsNumber()
  designerId: number;

  @IsNumber()
  orderId: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
