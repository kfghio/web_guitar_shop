import { Field, ObjectType } from '@nestjs/graphql';
import { Category } from './category.entity';

@ObjectType()
export class PaginatedCategories {
  @Field(() => [Category])
  data: Category[];

  @Field()
  total: number;

  @Field()
  page: number;

  @Field()
  limit: number;

  @Field()
  totalPages: number;
}
