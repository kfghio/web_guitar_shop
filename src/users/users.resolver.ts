import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedUsers } from './entities/paginated-users.object-type';
import { Profile } from './entities/profile.entity';
import { Role } from './entities/role.entity';
import { Order } from '../orders/entities/order.entity';
import { Review } from '../reviews/entities/review.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => PaginatedUsers)
  async users(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<PaginatedUsers> {
    const [data, total] = await this.usersService.findWithPagination(
      page,
      limit,
    );
    const totalPages = Math.ceil(total / limit);
    return { data, total, page, limit, totalPages };
  }

  @Query(() => User)
  async user(@Args('id', { type: () => Int }) id: number): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserDto): Promise<User> {
    return this.usersService.createUser(input);
  }

  @Mutation(() => User)
  async updateUser(@Args('input') input: UpdateUserDto): Promise<User> {
    return this.usersService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.usersService.remove(id);
    return true;
  }

  @ResolveField(() => Profile, { nullable: true })
  profile(@Parent() user: User): Profile | null {
    if (!user.profile) return null;
    return user.profile;
  }

  @ResolveField(() => Role)
  role(@Parent() user: User): Role {
    return user.role;
  }

  @ResolveField(() => [Order])
  orders(@Parent() user: User): Order[] {
    return user.orders;
  }

  @ResolveField(() => [Review])
  reviews(@Parent() user: User): Review[] {
    return user.reviews;
  }
}
