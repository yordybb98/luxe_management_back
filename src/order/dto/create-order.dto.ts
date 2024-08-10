import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  name: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  phone: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  address: string;

  @IsString()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  description: string;

  @IsNumber()
  statusId: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  @IsOptional()
  projectId: number;
}
