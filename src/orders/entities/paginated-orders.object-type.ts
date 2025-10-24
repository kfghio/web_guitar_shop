import { Field, ObjectType } from '@nestjs/graphql';
import { Order } from './order.entity';

@ObjectType()
export class PaginatedOrders {
  @Field(() => [Order])
  data: Order[];

  @Field()
  total: number;

  @Field()
  page: number;

  @Field()
  limit: number;

  @Field()
  totalPages: number;
}
