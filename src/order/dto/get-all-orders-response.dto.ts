import { Order } from 'src/common/types/order';

export class GetAllOrdersResponseDto {
  data: Order[];
  total: number;
}
