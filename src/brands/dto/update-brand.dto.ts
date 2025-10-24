import { CreateBrandDto } from './create-brand.dto';
import { InputType, PartialType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number;
}
