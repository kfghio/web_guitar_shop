import { Field, ObjectType } from '@nestjs/graphql';
import { OrderItem } from '../entities/order-item.entity';

@ObjectType()
export class PaginatedOrderItems {
  @Field(() => [OrderItem])
  data: OrderItem[];

  @Field()
  total: number;

  @Field()
  page: number;

  @Field()
  limit: number;

  @Field()
  totalPages: number;
}
