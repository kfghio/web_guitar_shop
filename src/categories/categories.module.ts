import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { ProductsModule } from '../products/products.module';
import { EventsModule } from '../events/events.module';
import { CategoriesApiController } from './categories.api.controller';
import { CategoriesResolver } from './categories.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    forwardRef(() => ProductsModule),
    EventsModule,
  ],
  controllers: [CategoriesController, CategoriesApiController],
  providers: [CategoriesService, CategoriesResolver],
  exports: [CategoriesService],
})
export class CategoriesModule {}
