import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Brand } from '../../brands/entities/brand.entity';
import { Review } from '../../reviews/entities/review.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';
import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Product {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  sku: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column('text')
  description: string;

  @Field(() => Float)
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Field(() => Int)
  @Column()
  stock: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  imageUrl: string;

  @Field(() => Category)
  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @Field(() => Brand)
  @ManyToOne(() => Brand, (brand) => brand.products, { onDelete: 'CASCADE' })
  brand: Brand;

  @Field(() => [Review], { nullable: 'itemsAndList' })
  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @Field(() => [OrderItem], { nullable: 'itemsAndList' })
  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];
}
