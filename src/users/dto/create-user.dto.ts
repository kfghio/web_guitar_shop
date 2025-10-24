import { IsEmail, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
class CreateProfileDto {
  @ApiProperty({ example: 'Иван', description: 'Имя пользователя' })
  @Field()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Иванов', description: 'Фамилия пользователя' })
  @Field()
  @IsString()
  lastName: string;
}

@InputType()
class CreateRoleDto {
  @ApiProperty({ example: 'пользователь', description: 'Название роли' })
  @Field()
  @IsString()
  name: string;
}

@InputType()
export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @Field()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль' })
  @Field()
  @IsString()
  password: string;

  @ApiProperty({ type: CreateProfileDto })
  @Field(() => CreateProfileDto)
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;

  @ApiProperty({ type: CreateRoleDto })
  @Field(() => CreateRoleDto)
  @ValidateNested()
  @Type(() => CreateRoleDto)
  role: CreateRoleDto;
}
