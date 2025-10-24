import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { OrderItemsModule } from './order-items/order-items.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { HttpModule } from '@nestjs/axios';
import { EventsModule } from './events/events.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { CacheModule } from '@nestjs/cache-manager';
import { ETagInterceptor } from './etag.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { StorageModule } from './s3/storage.module';
import { AuthController } from './users/auth.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => typeOrmConfig,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    CacheModule.register({
      ttl: 5000,
      max: 100,
      isGlobal: true,
    }),
    EventsModule,
    AuthModule,
    ProductsModule,
    HttpModule,
    OrdersModule,
    ReviewsModule,
    UsersModule,
    OrderItemsModule,
    BrandsModule,
    CategoriesModule,
    StorageModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ETagInterceptor,
    },
  ],
})
export class AppModule {}
