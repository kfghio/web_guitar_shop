import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../entities/order.entity';

export class PaginatedOrdersDto {
  @ApiProperty({ type: [Order], description: 'Массив заказов' })
  data: Order[];

  @ApiProperty({
    example: { total: 50, page: 1, limit: 10, totalPages: 5 },
    description: 'Метаданные пагинации',
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  @ApiProperty({
    example: {
      prev: null,
      next: 'http://localhost:3000/api/orders?page=2&limit=10',
    },
    description: 'Ссылки HATEOAS',
  })
  links: {
    prev: string | null;
    next: string | null;
  };
}
