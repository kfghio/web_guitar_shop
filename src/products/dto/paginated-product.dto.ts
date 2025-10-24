import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';

export class PaginatedProductsDto {
  @ApiProperty({ type: [Product], description: 'Массив товаров' })
  data: Product[];

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
      next: 'http://localhost:1234/api/products?page=2&limit=10',
    },
    description: 'Ссылки HATEOAS',
  })
  links: {
    prev: string | null;
    next: string | null;
  };
}
