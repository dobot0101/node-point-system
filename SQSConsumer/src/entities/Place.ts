import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Place {
  constructor(data: Partial<Place>) {
    return Object.assign(this, data);
  }
  @PrimaryColumn('uuid') id!: string;
  @Column('text') title!: string;
}
