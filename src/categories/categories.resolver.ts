import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginatedCategories } from './entities/paginated-categories.object-type';
import { Product } from '../products/entities/product.entity';

@Resolver(() => Category)
export class CategoriesResolver {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Query(() => PaginatedCategories)
  async categories(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<PaginatedCategories> {
    const [data, total] = await this.categoriesService.findWithPagination(
      page,
      limit,
    );
    const totalPages = Math.ceil(total / limit);
    return { data, total, page, limit, totalPages };
  }

  @Query(() => Category)
  async category(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Mutation(() => Category)
  async createCategory(
    @Args('input') input: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.create(input);
  }

  @Mutation(() => Category)
  async updateCategory(
    @Args('input') input: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.categoriesService.remove(id);
    return true;
  }

  @ResolveField(() => [Product])
  async products(@Parent() category: Category): Promise<Product[]> {
    return (await this.categoriesService.findOneWithProducts(category.id))
      .products;
  }
}
