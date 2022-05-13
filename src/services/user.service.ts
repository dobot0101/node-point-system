import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entity/user.entity';
import bcrypt from 'bcrypt';

export class UserService {
  private users: User[] = [];

  getAll() {
    return this.users;
  }

  getOne(id: number) {
    return this.users.find(user => user.id === id);
  }

  async signUp(userData: CreateUserDto) {
    const { email, name, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: User = {
      id: this.users.length + 1,
      email,
      name,
      password: hashedPassword,
    };
    this.users.push(user);
    return user;
  }

  async login(email: string, password: string) {
    const user = this.users.find(user => user.email === email);
    if (user) {
      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (isPasswordMatched) {
        return user;
      }
      throw new Error('invalid password');
    } else {
      throw new Error(`can't find user`);
    }
  }

  deleteOne(id: number) {
    this.users = this.users.filter(user => user.id !== id);
    console.log(this.users);
    return id;
  }

  update(id: number, userData: UpdateUserDto) {
    const user = this.getOne(id);
    this.deleteOne(id);
    this.users.push({
      ...user,
      ...userData,
    });
    return this.getOne(id);
  }
}
