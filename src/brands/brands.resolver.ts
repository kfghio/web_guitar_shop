import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { BrandsService } from './brands.service';
import { PaginatedBrands } from './entities/paginated-brands.object-type';
import { Product } from '../products/entities/product.entity';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Resolver(() => Brand)
export class BrandsResolver {
  constructor(private readonly brandsService: BrandsService) {}

  // Запрос всех брендов с пагинацией
  @Query(() => PaginatedBrands)
  async brands(
    @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
  ): Promise<PaginatedBrands> {
    const [data, total] = await this.brandsService.findWithPagination(
      page,
      limit,
    );
    const totalPages = Math.ceil(total / limit);
    return { data, total, page, limit, totalPages };
  }

  // Запрос бренда по ID
  @Query(() => Brand)
  async brand(@Args('id', { type: () => Int }) id: number): Promise<Brand> {
    return this.brandsService.findOne(id);
  }

  // Создание бренда
  @Mutation(() => Brand)
  async createBrand(@Args('input') input: CreateBrandDto): Promise<Brand> {
    return this.brandsService.create(input);
  }

  // Обновление бренда
  @Mutation(() => Brand)
  async updateBrand(@Args('input') input: UpdateBrandDto): Promise<Brand> {
    return this.brandsService.update(input.id, input);
  }

  // Удаление бренда
  @Mutation(() => Boolean)
  async deleteBrand(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    await this.brandsService.remove(id);
    return true;
  }

  // ResolveField для продуктов
  @ResolveField(() => [Product])
  async products(@Parent() brand: Brand): Promise<Product[]> {
    return (await this.brandsService.findOneWithProducts(brand.id)).products;
  }
}
