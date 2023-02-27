import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { createHttpException } from 'src/helpers/createHttpException';
import { HttpStatus } from '@nestjs/common';
import { ErrorMessages } from 'src/helpers/responseMessages';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<UserEntity> {
    const createdUser = await this.userService.create(createUserDto);
    return createdUser;
  }

  async login(user: UserEntity) {
    const { id, login } = user;

    const accessToken = await this.jwtService.signAsync(
      { userId: id, login },
      {
        secret: process.env.SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRATION_TIME,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { userId: id, login },
      {
        secret: process.env.SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRATION_TIME,
      },
    );

    return { accessToken, refreshToken };
  }

  async refresh(body: { refreshToken: string }) {
    const { refreshToken } = body;
    if (!refreshToken)
      createHttpException(
        ErrorMessages.noRefreshToken,
        HttpStatus.UNAUTHORIZED,
      );

    try {
      const { userId, login } = this.jwtService.verify(refreshToken);
      const user = new UserEntity(login, userId);
      return await this.login(user);
    } catch {
      createHttpException(
        ErrorMessages.invalidRefreshToken,
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async validateUser(
    login: string,
    password: string,
  ): Promise<UserEntity> | null {
    const user = await this.userService.findOneByLogin(login);
    if (user === null) return null;

    const verification = await bcrypt.compare(password, user.password);
    if (!verification) return null;
    return user;
  }
}
