import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Brand {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  logoUrl: string;

  @Field(() => [Product], { nullable: 'itemsAndList' })
  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}
