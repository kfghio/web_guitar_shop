import { Field, ObjectType } from '@nestjs/graphql';
import { Brand } from './brand.entity';

@ObjectType()
export class PaginatedBrands {
  @Field(() => [Brand])
  data: Brand[];

  @Field()
  total: number;

  @Field()
  page: number;

  @Field()
  limit: number;

  @Field()
  totalPages: number;
}
