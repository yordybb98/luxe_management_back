import { IsEmail, IsOptional } from 'class-validator';

export class GetOrderDto {
  @IsEmail()
  @IsOptional()
  email: string;
}
