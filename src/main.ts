import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggerService } from './logger/logger.service';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import 'reflect-metadata';
import 'dotenv/config';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });

  const loggerExceptions = new Logger();
  process.on('uncaughtException', (err) => {
    loggerExceptions.error(err);
  });

  process.on('unhandledRejection', (err) => {
    loggerExceptions.error(err);
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const pathDoc = join(__dirname, '..', 'doc/api.yaml');
  const contentDoc = await readFile(pathDoc, 'utf-8');
  SwaggerModule.setup('doc', app, parse(contentDoc));

  await app.listen(PORT);
}

bootstrap();
