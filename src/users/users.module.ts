import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Role } from './entities/role.entity';
import { OrdersModule } from '../orders/orders.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { EventsModule } from '../events/events.module';
import { UsersApiController } from './users.api.controller';
import { UsersResolver } from './users.resolver';
import { AuthModule } from '../auth/auth.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Profile, Role]),
    forwardRef(() => OrdersModule),
    forwardRef(() => ReviewsModule),
    EventsModule,
    AuthModule,
  ],
  controllers: [UsersController, UsersApiController, AuthController],
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
