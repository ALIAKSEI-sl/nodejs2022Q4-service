import { HttpException } from '@nestjs/common';

export function createHttpException(message: string, httpStatus: number) {
  throw new HttpException(message, httpStatus);
}
