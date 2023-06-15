import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
  @PrimaryColumn('uuid') id!: string;
  @Column('varchar', { length: 30 }) email!: string;
  @Column('varchar', { length: 30 }) password!: string;
  @Column('timestamp') createdAt!: Date;
}
