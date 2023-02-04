import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserEntity } from './entities/user.entity';
import { InMemoryDb } from '../../db/db.service.db';
import { HttpStatus } from '@nestjs/common';
import { createHttpException } from '../../helpers/createHttpException';
import { ErrorMessages } from '../../helpers/responseMessages';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private db: InMemoryDb) {}

  create(createUserDto: CreateUserDto): UserEntity {
    const date = Date.now();
    const user = new UserEntity({
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: date,
      updatedAt: date,
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
    if (user === undefined) {
      createHttpException(ErrorMessages.nonExistentUser, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto): UserEntity {
    const userIndex = this.db.users.findIndex(
      ({ id: userId }) => userId === id,
    );
    if (userIndex === -1) {
      createHttpException(ErrorMessages.nonExistentUser, HttpStatus.NOT_FOUND);
    }

    const user = this.db.users[userIndex];

    if (user.password === updatePasswordDto.newPassword) {
      createHttpException(ErrorMessages.equalPasswords, HttpStatus.FORBIDDEN);
    } else if (user.password !== updatePasswordDto.oldPassword) {
      createHttpException(
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
      createHttpException(ErrorMessages.nonExistentUser, HttpStatus.NOT_FOUND);
    }

    this.db.users.splice(userIndex, 1);
  }
}
