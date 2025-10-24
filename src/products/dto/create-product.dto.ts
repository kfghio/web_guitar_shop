import {
  IsString,
  IsDecimal,
  IsInt,
  IsUrl,
  IsOptional,
  Min, IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateProductDto {
  @ApiProperty({ example: 'GTR-200', description: 'SKU товара' })
  @Field()
  @IsString()
  sku: string;

  @ApiProperty({
    example: 'Электрогитара Fender',
    description: 'Название товара',
  })
  @Field()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Профессиональная электрогитара',
    description: 'Описание товара',
  })
  @Field()
  @IsString()
  description: string;

  @ApiProperty({ example: 25000, description: 'Цена товара' })
  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @ApiProperty({ example: 10, description: 'Количество на складе' })
  @Field(() => Int)
  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  stock: number;

  @ApiProperty({
    example: 'https://example.com/image.jpg',
    description: 'URL изображения',
    required: false,
  })
  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 1, description: 'ID категории' })
  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  categoryId: number;

  @ApiProperty({ example: 1, description: 'ID бренда' })
  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  brandId: number;
}
