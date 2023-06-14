import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Place } from './Place';
import { User } from './User';

@Entity()
export class Review {
  @PrimaryColumn('uuid') id!: string;
  @Column('text') content!: string;
  @Column('timestamp with time zone') created_at!: Date;
  @Column('timestamp with time zone') modified_at!: Date | null;

  @ManyToOne(() => User)
  userId!: string;

  @ManyToOne(() => Place)
  placeId!: string;
}

@Entity()
export class ReviewPhoto {
  @PrimaryColumn('uuid') id!: string;
  @Column('timestamp with time zone') createdAt!: Date;

  @ManyToOne(() => Review)
  reviewId!: string;
}
