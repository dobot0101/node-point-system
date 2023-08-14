import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Review } from './Review';

@Entity()
export class Place {
  @PrimaryColumn('uuid') id!: string;
  @OneToMany(() => Review, (review) => review.place)
  review!: Review;
}
