import { Field, ObjectType } from '@nestjs/graphql';
import { Review } from './review.entity';

@ObjectType()
export class PaginatedReviews {
  @Field(() => [Review])
  data: Review[];

  @Field()
  total: number;

  @Field()
  page: number;

  @Field()
  limit: number;

  @Field()
  totalPages: number;
}
