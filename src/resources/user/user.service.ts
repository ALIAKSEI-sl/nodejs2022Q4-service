import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserEntity } from './entities/user.entity';
import { HttpStatus } from '@nestjs/common';
import { createHttpException } from '../../helpers/createHttpException';
import { ErrorMessages } from '../../helpers/responseMessages';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const existenceUser = await this.userRepository.findOne({
      where: { login: createUserDto.login },
    });
    if (existenceUser) {
      createHttpException(
        ErrorMessages.userAlreadyExists,
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = new UserEntity(createUserDto.login, createUserDto.password);

    const createdUser = this.userRepository.create(user);
    const savedUser = await this.userRepository.save(createdUser);
    return savedUser;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: string): Promise<UserEntity> | null {
    const user = await this.userRepository.findOne({ where: { id } });
    return user;
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user === null) return null;

    if (user.password === updatePasswordDto.newPassword) {
      createHttpException(ErrorMessages.equalPasswords, HttpStatus.FORBIDDEN);
    } else if (user.password !== updatePasswordDto.oldPassword) {
      createHttpException(
        ErrorMessages.incorrectPassword,
        HttpStatus.FORBIDDEN,
      );
    }

    user.password = updatePasswordDto.newPassword;
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }

  async remove(id: string): Promise<void> {
    const deletedUser = await this.userRepository.delete(id);
    if (deletedUser.affected === 0) {
      createHttpException(ErrorMessages.nonExistentUser, HttpStatus.NOT_FOUND);
    }
  }
}
