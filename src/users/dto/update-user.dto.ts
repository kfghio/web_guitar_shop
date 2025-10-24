import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, ValidateNested, IsInt, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
class UpdateProfileDto {
  @ApiProperty({ required: false })
  @Field()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false })
  @Field()
  @IsString()
  @IsOptional()
  lastName?: string;
}

@InputType()
class UpdateRoleDto {
  @ApiProperty({ required: false })
  @Field()
  @IsString()
  @IsOptional()
  name?: string;
}

@InputType()
export class UpdateUserDto {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ required: false })
  @Field()
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @Field()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ required: false })
  @Field(() => UpdateProfileDto)
  @ValidateNested()
  @Type(() => UpdateProfileDto)
  @IsOptional()
  profile?: UpdateProfileDto;

  @ApiProperty({ required: false })
  @Field(() => UpdateRoleDto)
  @ValidateNested()
  @Type(() => UpdateRoleDto)
  @IsOptional()
  role?: UpdateRoleDto;
}
