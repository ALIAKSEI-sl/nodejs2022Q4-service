import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private loggerHttp = new Logger();

  use(req: Request, res: Response, next: NextFunction) {
    const { url, method, query, body } = req;

    res.on('finish', () => {
      const { statusCode } = res;
      const message = `method - ${method};
      url - ${url};
      queries - ${JSON.stringify(query)};
      body - ${JSON.stringify(body)};
      status code - ${statusCode}`;
      this.loggerHttp.log(message);
    });
    next();
  }
}
