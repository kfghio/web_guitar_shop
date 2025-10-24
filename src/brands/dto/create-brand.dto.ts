import { IsString, IsUrl, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateBrandDto {
  @ApiProperty({
    example: 'Chi No Ni',
    description: 'Название бренда',
  })
  @Field()
  @IsString()
  name: string;
  @ApiProperty({
    example:
      'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
    description: 'url logo',
  })
  @Field({ nullable: true })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;
}
