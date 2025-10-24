import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginatedProducts } from './entities/paginated-products.object-type';
import { Category } from '../categories/entities/category.entity';
import { Brand } from '../brands/entities/brand.entity';
import { Review } from '../reviews/entities/review.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => PaginatedProducts)
  async products(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<PaginatedProducts> {
    const [data, total] = await this.productsService.findWithPagination(
      page,
      limit,
    );
    const totalPages = Math.ceil(total / limit);
    return { data, total, page, limit, totalPages };
  }

  @Query(() => Product)
  async product(@Args('id', { type: () => Int }) id: number): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Query(() => [Product])
  async productsByCategory(
    @Args('categoryId', { type: () => Int }) categoryId: number,
  ): Promise<Product[]> {
    return this.productsService.findByCategory(categoryId);
  }

  @Mutation(() => Product)
  async createProduct(
    @Args('input') input: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.create(input);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('input') input: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  async deleteProduct(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.productsService.remove(id);
    return true;
  }

  @ResolveField(() => Category)
  category(@Parent() product: Product): Category {
    return product.category;
  }

  @ResolveField(() => Brand)
  brand(@Parent() product: Product): Brand {
    return product.brand;
  }

  @ResolveField(() => [Review])
  reviews(@Parent() product: Product): Review[] {
    return product.reviews;
  }

  @ResolveField(() => [OrderItem])
  orderItems(@Parent() product: Product): OrderItem[] {
    return product.orderItems;
  }
}
