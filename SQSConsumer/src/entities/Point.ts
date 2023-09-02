import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Review } from './Review';
import { User } from './User';

export enum PointSourceType {
  TEXT_REVIEW = 'TEXT_REVIEW',
  PHOTO_REVIEW = 'PHOTO_REVIEW',
  PLACE_REVIEW = 'PLACE_REVIEW',
  CANCELED_REVIEW = 'CANCELED_REVIEW',
}

export enum PointType {
  ISSUANCE = 'ISSUANCE',
  SPENDING = 'SPENDING',
}

@Entity()
export class Point {
  constructor(data: Partial<Point>) {
    Object.assign(this, data);
  }

  @PrimaryColumn('uuid') id!: string;
  @Column('int') amount!: number;

  @Column({
    type: 'enum',
    enum: PointType,
    default: PointType.ISSUANCE,
  })
  type!: PointType;

  @Column({
    type: 'enum',
    enum: PointSourceType,
    default: PointSourceType.TEXT_REVIEW,
  })
  sourceType!: PointSourceType;

  @Column('timestamptz') createdAt!: Date;

  @ManyToOne(() => User)
  user!: User;

  @Column('uuid')
  userId!: string;

  @ManyToOne(() => Review)
  review!: Review;

  @Column('uuid')
  reviewId!: string;
}
