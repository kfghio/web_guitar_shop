import { Field, InputType, Int, Float } from '@nestjs/graphql';
import { IsInt, IsDecimal } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class CreateOrderItemDto {
  @Field(() => Int)
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  productId: number;

  @Field(() => Int)
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  orderId: number;

  @Field(() => Int)
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  quantity: number;

  @Field(() => Float)
  @IsDecimal({ decimal_digits: '2' })
  price: number;
}
