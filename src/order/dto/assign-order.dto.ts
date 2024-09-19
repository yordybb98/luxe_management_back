import { IsNumber } from 'class-validator';

export class AssignOrderDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  orderId: number;
}
