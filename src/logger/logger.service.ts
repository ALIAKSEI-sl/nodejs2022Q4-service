import { ConsoleLogger } from '@nestjs/common';
import { mkdir, readdir, open, stat, appendFile } from 'fs/promises';
import { join } from 'path';
import 'dotenv/config';

export class LoggerService extends ConsoleLogger {
  private maxFileSize = parseInt(process.env.MAX_FILE_SIZE);
  private loggingLevel = parseInt(process.env.LOGGING_LEVEL);

  constructor() {
    super();
  }

  async log(message: any, context?: string) {
    super.log(message, context);
    await this.writeToFile(message, 'log');
  }

  async error(message: any, stack?: string, context?: string) {
    if (this.loggingLevel >= 1) {
      super.error(message, stack, context);
      if (message instanceof Error) {
        const { message: errorMessage, name } = message;
        const messageContent = `${name} - ${errorMessage}
        ${context}`;
        await this.writeToFile(messageContent, 'error');
      } else {
        const messageContent = `${stack}
        ${message}`;
        await this.writeToFile(messageContent, 'error');
      }
    }
  }

  async warn(message: any, context?: string) {
    if (this.loggingLevel >= 2) {
      super.warn(message, context);
      await this.writeToFile(message, 'warn');
    }
  }

  async debug(message: any, context?: string) {
    if (this.loggingLevel >= 3) {
      super.debug(message, context);
    }
  }

  async verbose(message: any, context?: string) {
    if (this.loggingLevel >= 4) {
      super.verbose(message, context);
    }
  }

  async writeToFile(message: any, type: string) {
    const pathToFile = join(__dirname, 'files');
    await mkdir(pathToFile, { recursive: true });
    const files = await readdir(pathToFile);
    const pathToSaveDir = join(pathToFile, `${type}s`);
    if (!files.includes(`${type}s`)) {
      await mkdir(pathToSaveDir);
    }

    const saveDir = await readdir(pathToSaveDir);
    let fileName: string;
    let num = saveDir.length - 1;
    if (num === -1) {
      fileName = `${type}.txt`;
      await open(join(pathToSaveDir, fileName), 'w');
    } else {
      fileName = num === 0 ? `${type}.txt` : `${type}${num}.txt`;
    }

    const date = new Date().toLocaleString();
    const dateSize = Buffer.byteLength(date, 'utf-8');
    const { size } = await stat(join(pathToSaveDir, fileName)); // в байтах
    const messageSize = Buffer.byteLength(message, 'utf-8');
    const fullSize = size + messageSize + dateSize;
    if (fullSize > this.maxFileSize) {
      num += 1;
      fileName = `${type}${num}.txt`;
      await open(join(pathToSaveDir, fileName), 'w');
    }

    await appendFile(join(pathToSaveDir, fileName), `${date} - ${message}\n`);
  }
}
