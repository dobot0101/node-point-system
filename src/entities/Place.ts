import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Place {
  @PrimaryColumn('uuid') id!: string;
}
