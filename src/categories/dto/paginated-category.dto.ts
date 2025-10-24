import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../entities/category.entity';

export class PaginatedCategoriesDto {
  @ApiProperty({ type: [Category], description: 'Массив категорий' })
  data: Category[];

  @ApiProperty({
    example: { total: 4, page: 1, limit: 10, totalPages: 1 },
    description: 'Метаданные пагинации',
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  @ApiProperty({
    example: { prev: null, next: null },
    description: 'Ссылки HATEOAS',
  })
  links: {
    prev: string | null;
    next: string | null;
  };
}
