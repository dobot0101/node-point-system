import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Place } from '../../place/entity/Place';
import { User } from '../../user/entity/User';

@Entity()
export class Review {
  @PrimaryColumn('uuid') id!: string;
  @Column('text') content!: string;
  @Column('timestamp') createdAt!: Date;
  @Column('timestamp', { nullable: true }) modifiedAt!: Date | null;

  @ManyToOne(() => User)
  userId!: string;

  @ManyToOne(() => Place)
  place!: Place;
  placeId!: string;

  @OneToMany(() => ReviewPhoto, (photo) => photo.review, {
    eager: true,
    cascade: true,
  })
  photos!: ReviewPhoto[];
}

@Entity()
export class ReviewPhoto {
  @PrimaryColumn('uuid') id!: string;
  @Column('timestamp') createdAt!: Date;

  @ManyToOne(() => Review, { orphanedRowAction: 'delete' })
  review!: Review;
  reviewId!: string;
}
