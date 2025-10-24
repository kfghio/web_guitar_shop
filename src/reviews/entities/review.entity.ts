import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@ObjectType()
@Entity()
export class Review {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column()
  rating: number;

  @Field(() => String)
  @Column('text')
  comment: string;

  @Field(() => Date)
  @Column()
  createdAt: Date;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User, (user) => user.reviews, { onDelete: 'CASCADE' })
  user: User;

  @Field(() => Product)
  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  product: Product;
}
