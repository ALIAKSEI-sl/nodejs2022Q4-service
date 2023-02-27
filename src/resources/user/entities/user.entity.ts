import { Transform, Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  constructor(login: string, password: string) {
    this.login = login;
    this.password = password;
  }

  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4

  @Column()
  login: string;

  @Column()
  @Exclude()
  password: string;

  @VersionColumn()
  version: number; // integer number, increments on update

  @CreateDateColumn()
  @Transform(({ value }) => new Date(value).getTime())
  createdAt: number; // timestamp of creation

  @UpdateDateColumn()
  @Transform(({ value }) => new Date(value).getTime())
  updatedAt: number; // timestamp of last update
}
