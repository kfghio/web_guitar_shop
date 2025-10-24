import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PaginatedOrders } from './entities/paginated-orders.object-type';
import { User } from '../users/entities/user.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Query(() => PaginatedOrders)
  async orders(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<PaginatedOrders> {
    const [data, total] = await this.ordersService.findWithPagination(
      page,
      limit,
    );
    const totalPages = Math.ceil(total / limit);
    return { data, total, page, limit, totalPages };
  }

  @Query(() => Order)
  async order(@Args('id', { type: () => Int }) id: number): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Mutation(() => Order)
  async createOrder(@Args('input') input: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(input);
  }

  @Mutation(() => Order)
  async updateOrder(@Args('input') input: UpdateOrderDto): Promise<Order> {
    return this.ordersService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  async deleteOrder(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.ordersService.remove(id);
    return true;
  }

  @ResolveField(() => User)
  user(@Parent() order: Order): User {
    return order.user;
  }

  @ResolveField(() => [OrderItem])
  items(@Parent() order: Order): OrderItem[] {
    return order.items;
  }
}
