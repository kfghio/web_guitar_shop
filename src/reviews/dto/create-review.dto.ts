import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateReviewDto {
  @ApiProperty({
    example: 5,
    description: 'Оценка от 1 до 5',
    minimum: 1,
    maximum: 5,
  })
  @Field(() => Int)
  @IsNumber()
  @Min(1)
  @Max(5)
  @Transform(({ value }) => parseInt(value, 10))
  rating: number;

  @ApiProperty({
    example: 'Отличный товар!',
    description: 'Текст отзыва',
  })
  @Field()
  @IsString()
  comment: string;

  @ApiProperty({
    example: 1,
    description: 'ID товара',
  })
  @Field(() => Int)
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  productId: number;

  @ApiProperty({
    example: '2025-03-29T14:54:18.367Z',
    description: 'дата',
  })
  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  createdAt?: Date;
}
