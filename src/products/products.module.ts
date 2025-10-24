import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CategoriesModule } from '../categories/categories.module';
import { BrandsModule } from '../brands/brands.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { OrderItemsModule } from '../order-items/order-items.module';
import { EventsModule } from '../events/events.module';
import { ProductsApiController } from './products.api.controller';
import { ProductsResolver } from './products.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => CategoriesModule),
    forwardRef(() => BrandsModule),
    forwardRef(() => ReviewsModule),
    forwardRef(() => OrderItemsModule),
    EventsModule,
  ],
  controllers: [ProductsController, ProductsApiController],
  providers: [ProductsService, ProductsResolver],
  exports: [ProductsService],
})
export class ProductsModule {}
