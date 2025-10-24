import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { OrderItemsService } from './order-items.service';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { PaginatedOrderItems } from './entities/paginated-order-items.object-type';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';

@Resolver(() => OrderItem)
export class OrderItemsResolver {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Query(() => PaginatedOrderItems)
  async orderItems(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<PaginatedOrderItems> {
    const [data, total] = await this.orderItemsService.findWithPagination(
      page,
      limit,
    );
    const totalPages = Math.ceil(total / limit);
    return { data, total, page, limit, totalPages };
  }

  @Query(() => OrderItem)
  async orderItem(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<OrderItem> {
    return this.orderItemsService.findOne(id);
  }

  @Mutation(() => OrderItem)
  async createOrderItem(
    @Args('input') input: CreateOrderItemDto,
  ): Promise<OrderItem> {
    return this.orderItemsService.create(input);
  }

  @Mutation(() => OrderItem)
  async updateOrderItem(
    @Args('input') input: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    return this.orderItemsService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  async deleteOrderItem(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.orderItemsService.remove(id);
    return true;
  }

  @ResolveField(() => Product)
  product(@Parent() orderItem: OrderItem): Product {
    return orderItem.product;
  }

  @ResolveField(() => Order)
  order(@Parent() orderItem: OrderItem): Order {
    return orderItem.order;
  }
}
