import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class UpdateReviewDto {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ required: false })
  @Field(() => Int)
  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({ required: false })
  @Field()
  @IsString()
  @IsOptional()
  comment?: string;
}
