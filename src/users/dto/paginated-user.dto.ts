import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class PaginatedUsersDto {
  @ApiProperty({ type: [User], description: 'Массив пользователей' })
  data: User[];

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
      next: 'http://localhost:12345/api/users?page=2&limit=10',
    },
    description: 'Ссылки HATEOAS',
  })
  links: {
    prev: string | null;
    next: string | null;
  };
}
