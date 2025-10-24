import { InputType, PartialType, Field, Int } from '@nestjs/graphql';
import { CreateOrderDto } from './create-order.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number;
}
