import { ApiProperty } from '@nestjs/swagger';
import { Review } from '../entities/review.entity';

export class PaginatedReviewsDto {
  @ApiProperty({ type: [Review], description: 'Массив отзывов' })
  data: Review[];

  @ApiProperty({
    example: { total: 100, page: 1, limit: 10, totalPages: 10 },
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
      next: 'http://localhost:12345/api/reviews?page=2&limit=10',
    },
    description: 'Ссылки HATEOAS',
  })
  links: {
    prev: string | null;
    next: string | null;
  };
}
