import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Place } from '../../place/entity/Place';
import { User } from '../../user/entity/User';
import { ReviewPhoto } from './ReviewPhoto';

@Entity()
export class Review {
  constructor(data: Partial<Review>) {
    Object.assign(this, data);
  }
  @PrimaryColumn('uuid') id!: string;
  @Column('text') content!: string;
  @Column('timestamptz') createdAt!: Date;
  @Column('timestamptz', { nullable: true }) modifiedAt!: Date | null;

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
