import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsUrl,
  IsOptional,
  Min,
  IsInt,
  IsNotEmpty,
} from 'class-validator';
import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateProductDto {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ required: false })
  @Field()
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ required: false })
  @Field()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ required: false })
  @Field()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @Field(() => Float)
  @IsNumber()
  @Min(1000)
  @IsOptional()
  price?: number;

  @ApiProperty({ required: false })
  @Field(() => Int)
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({ required: false })
  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ required: false })
  @Field(() => Int)
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ required: false })
  @Field(() => Int)
  @IsNumber()
  @IsOptional()
  brandId?: number;
}
