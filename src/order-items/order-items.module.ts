import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from './order-items.service';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';
import { EventsModule } from '../events/events.module';
import { OrderItemsResolver } from './order-items.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItem]),
    forwardRef(() => OrdersModule),
    forwardRef(() => ProductsModule),
    EventsModule,
  ],
  controllers: [OrderItemsController],
  providers: [OrderItemsService, OrderItemsResolver],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
