import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { createHttpException } from 'src/helpers/createHttpException';
import { ErrorMessages } from 'src/helpers/responseMessages';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'login', passwordField: 'password' });
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      createHttpException(ErrorMessages.nonValidate, HttpStatus.FORBIDDEN);
    }
    return user;
  }
}
