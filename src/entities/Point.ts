import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Point {
  @PrimaryColumn('uuid') id!: string;
  @Column('text') memo!: string;
  @Column('int') amount!: number;
  @Column('string') sourceType!: string;
  @Column('uuid') sourceId!: string;
  @Column('timestamp with time zone') createdAt!: Date;

  @ManyToOne(() => User)
  userId!: string;
}
