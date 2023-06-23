import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';

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
