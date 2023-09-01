import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength, minLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @MinLength(8)
  @IsNotEmpty()
  password!: string;
}
