import { timeStamp } from 'console';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entity/user.entity';

export class UserService {
  private users: User[] = [];

  getAll() {
    return this.users;
  }

  getOne(id: number) {
    return this.users.find(user => user.id === id);
  }

  create(userData: CreateUserDto) {
    const user: User = {
      id: this.users.length + 1,
      ...userData,
    };
    this.users.push(user);
    return user;
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
