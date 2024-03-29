import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
  @PrimaryColumn('uuid') id!: string;
  @Column('varchar', { length: 30, unique: true }) email!: string;
  @Column('text') password!: string;
  @Column('boolean', { default: false }) isAdmin!: boolean;
  @Column('timestamptz') createdAt!: Date;
}
