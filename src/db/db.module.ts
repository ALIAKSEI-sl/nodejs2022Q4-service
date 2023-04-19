import { Module } from '@nestjs/common';
import { InMemoryDb } from './db.service.db';

@Module({
  exports: [InMemoryDb],
  providers: [InMemoryDb],
})
export class DbModule {}
