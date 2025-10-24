import { Field, InputType } from '@nestjs/graphql';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateCategoryDto {
  @ApiProperty({
    example: 'Ukulele',
    description: 'Название категории',
  })
  @Field()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Маленькая акустическая гитара',
    description: 'Описание категории',
    required: false,
  })
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;
}
