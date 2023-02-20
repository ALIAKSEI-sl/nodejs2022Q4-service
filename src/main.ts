import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import 'reflect-metadata';
import 'dotenv/config';

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ enableDebugMessages: true, whitelist: true }),
  );

  const pathDoc = join(__dirname, '..', 'doc/api.yaml');
  const contentDoc = await readFile(pathDoc, 'utf-8');
  SwaggerModule.setup('doc', app, parse(contentDoc));

  await app.listen(PORT);
}

bootstrap();
