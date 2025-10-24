import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PaginatedReviews } from './entities/paginated-reviews.object-type';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Query(() => PaginatedReviews)
  async reviews(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<PaginatedReviews> {
    const [data, total] = await this.reviewsService.findWithPagination(
      page,
      limit,
    );
    const totalPages = Math.ceil(total / limit);
    return { data, total, page, limit, totalPages };
  }

  @Query(() => Review)
  async review(@Args('id', { type: () => Int }) id: number): Promise<Review> {
    return this.reviewsService.findOne(id);
  }

  @Mutation(() => Review)
  async createReview(@Args('input') input: CreateReviewDto): Promise<Review> {
    return this.reviewsService.create(input);
  }

  @Mutation(() => Review)
  async updateReview(@Args('input') input: UpdateReviewDto): Promise<Review> {
    return this.reviewsService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  async deleteReview(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.reviewsService.remove(id);
    return true;
  }

  @ResolveField(() => User, { nullable: true })
  user(@Parent() review: Review): User | null {
    if (!review.user) return null;
    return review.user;
  }

  @ResolveField(() => Product)
  product(@Parent() review: Review): Product {
    return review.product;
  }
}
