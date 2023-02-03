import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { InMemoryDb } from '../../db/db.service.db';
import { UserEntity } from './entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorMessages } from '../../helpers/responseMessages';

@Injectable()
export class UserService {
  constructor(private db: InMemoryDb) {}

  create(createUserDto: CreateUserDto): UserEntity {
    const date = Date.now();

    const user = new UserEntity({
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1, // integer number, increments on update
      createdAt: date, // timestamp of creation
      updatedAt: date, // timestamp of last update
    });

    this.db.users.push(user);

    return user;
  }

  findAll(): UserEntity[] {
    const users = this.db.users;
    return users;
  }

  findOne(id: string): UserEntity {
    const user = this.db.users.find(({ id: userId }) => userId === id);
    if (!user) {
      throw new HttpException(
        ErrorMessages.nonExistentUser,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto): UserEntity {
    const userIndex = this.db.users.findIndex(
      ({ id: userId }) => userId === id,
    );
    if (userIndex === -1) {
      throw new HttpException(
        ErrorMessages.nonExistentUser,
        HttpStatus.NOT_FOUND,
      );
    }

    const user = this.db.users[userIndex];

    if (user.password === updatePasswordDto.newPassword) {
      throw new HttpException(
        ErrorMessages.equalPasswords,
        HttpStatus.FORBIDDEN,
      );
    } else if (user.password !== updatePasswordDto.oldPassword) {
      throw new HttpException(
        ErrorMessages.incorrectPassword,
        HttpStatus.FORBIDDEN,
      );
    }

    const date = Date.now();
    user.password = updatePasswordDto.newPassword;
    user.version++;
    user.updatedAt = date;

    return user;
  }

  remove(id: string): void {
    const userIndex = this.db.users.findIndex(
      ({ id: userId }) => userId === id,
    );
    if (userIndex === -1) {
      throw new HttpException(
        ErrorMessages.nonExistentUser,
        HttpStatus.NOT_FOUND,
      );
    }

    this.db.users.splice(userIndex, 1);
  }
}
