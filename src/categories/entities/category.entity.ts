import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
@Entity()
export class Category {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field(() => [Product], { nullable: 'itemsAndList' })
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
