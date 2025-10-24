import { IsInt, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Field, Float, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  @Field(() => Int)
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  userId: number;

  @ApiProperty({ example: 15000, description: 'Общая сумма заказа' })
  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  total?: number;

  @ApiProperty({
    example: 'Ожидание',
    description: 'Статус заказа',
    enum: ['Ожидание', 'Завершено', 'Отменено'],
  })
  @Field(() => String, { nullable: true })
  @IsOptional()
  status?: 'Ожидание' | 'Завершено' | 'Отменено';
}
