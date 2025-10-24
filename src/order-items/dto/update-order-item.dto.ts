import { InputType, PartialType, Field, Int } from '@nestjs/graphql';
import { CreateOrderItemDto } from './create-order-item.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number;
}
