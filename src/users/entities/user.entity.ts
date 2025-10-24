import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany, ManyToOne,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Role } from './role.entity';
import { Order } from '../../orders/entities/order.entity';
import { Review } from '../../reviews/entities/review.entity';

@ObjectType()
@Entity()
export class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, unique: true })
  firebaseUid?: string;

  @Field()
  @Column()
  email: string;

  @Column()
  password: string;

  @Field(() => Profile, { nullable: true })
  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile?: Profile;

  @Field(() => Role)
  @ManyToOne(() => Role, (role) => role.user)
  @JoinColumn()
  role: Role;

  @Field(() => [Order], { nullable: 'itemsAndList' })
  @OneToMany(() => Order, (order) => order.user, { cascade: true })
  orders: Order[];

  @Field(() => [Review], { nullable: 'itemsAndList' })
  @OneToMany(() => Review, (review) => review.user, { cascade: true })
  reviews: Review[];
}
