/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import {v4 as uuid} from 'uuid';
import { UserDto } from './user.dto';
import { hashSync as bcryptHashSync } from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly users: UserDto[] = [];
  
create(newUser: UserDto) {
    newUser.id = uuid();
    newUser.password = bcryptHashSync(newUser.password, 10);
    this.users.push(newUser);
    console.log(this.users);
}

findByUserName(username: string): UserDto | null {
  return this.users.find(user => user.username === username);
}
  
}
