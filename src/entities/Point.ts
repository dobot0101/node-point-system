import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Point {
  constructor(data: Partial<Point>) {
    Object.assign(this, data);
  }

  @PrimaryColumn('uuid') id!: string;
  @Column('text') memo!: string;
  @Column('int') amount!: number;
  @Column('varchar', { length: 20 }) sourceType!: string;
  @Column('uuid') sourceId!: string;
  @Column('timestamp') createdAt!: Date;

  @ManyToOne(() => User)
  userId!: string;
}
