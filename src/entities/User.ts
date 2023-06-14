import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn('uuid') id!: string;
}
