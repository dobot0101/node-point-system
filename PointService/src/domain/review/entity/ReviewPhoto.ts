import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Review } from './Review';

@Entity()
export class ReviewPhoto {
  constructor(data: Partial<ReviewPhoto>) {
    Object.assign(this, data);
  }

  @PrimaryColumn('uuid') id!: string;
  @Column('timestamptz') createdAt!: Date;

  @ManyToOne(() => Review, { orphanedRowAction: 'delete' })
  review!: Review;
  reviewId!: string;
}
