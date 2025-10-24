import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { UsersModule } from '../users/users.module';
import { OrderItemsModule } from '../order-items/order-items.module';
import { EventsModule } from '../events/events.module';
import { OrdersApiController } from './orders.api.controller';
import { OrdersResolver } from './orders.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    forwardRef(() => UsersModule),
    forwardRef(() => OrderItemsModule),
    EventsModule,
  ],
  controllers: [OrdersController, OrdersApiController],
  providers: [OrdersService, OrdersResolver],
  exports: [OrdersService],
})
export class OrdersModule {}
