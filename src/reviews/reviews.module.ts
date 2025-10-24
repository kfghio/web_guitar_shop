// src/reviews/reviews.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { UsersModule } from '../users/users.module';
import { ProductsModule } from '../products/products.module';
import { EventsModule } from '../events/events.module';
import { ReviewsApiController } from './reviews.api.controller';
import { ReviewsResolver } from './reviews.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    forwardRef(() => UsersModule),
    forwardRef(() => ProductsModule),
    EventsModule,
  ],
  controllers: [ReviewsController, ReviewsApiController],
  providers: [ReviewsService, ReviewsResolver],
  exports: [ReviewsService],
})
export class ReviewsModule {}
