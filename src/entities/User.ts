import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn('uuid') id!: string;
  @Column('varchar', { length: 30 }) email!: string;
  @Column('varchar', { length: 30 }) password!: string;
  @Column('timestamp') createdAt!: Date;
}
