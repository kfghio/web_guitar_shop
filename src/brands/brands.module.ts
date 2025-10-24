// src/brands/brands.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { Brand } from './entities/brand.entity';
import { ProductsModule } from '../products/products.module';
import { EventsModule } from '../events/events.module';
import { BrandsApiController } from './brands.api.controller';
import { BrandsResolver } from './brands.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand]),
    forwardRef(() => ProductsModule),
    EventsModule,
  ],
  controllers: [BrandsController, BrandsApiController],
  providers: [BrandsService, BrandsResolver],
  exports: [BrandsService],
})
export class BrandsModule {}
