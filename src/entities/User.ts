import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
  @PrimaryColumn('uuid') id!: string;
  @Column('varchar', { length: 30 }) email!: string;
  @Column('varchar', { length: 30 }) password!: string;
  @Column('boolean') isAdmin!: boolean;
  @Column('timestamp') createdAt!: Date;
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsStrongPassword(
    {
      minLength: 8,
      minSymbols: 2,
    },
    {
      message: '비밀번호는 최소 8자리 이상 2개의 특수문자가 포함돼야합니다.',
    },
  )
  @IsNotEmpty()
  password!: string;
}
