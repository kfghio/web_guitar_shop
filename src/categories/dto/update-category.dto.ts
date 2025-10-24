import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateCategoryDto } from './create-category.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number;
}
