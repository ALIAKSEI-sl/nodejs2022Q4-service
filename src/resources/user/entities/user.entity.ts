import { Exclude } from 'class-transformer';

export class UserEntity {
  constructor(object: UserEntity) {
    this.id = object.id;
    this.login = object.login;
    this.password = object.password;
    this.version = object.version;
    this.createdAt = object.createdAt;
    this.updatedAt = object.updatedAt;
  }

  id: string; // uuid v4
  login: string;

  @Exclude()
  password: string;

  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}
