import { Module } from '@nestjs/common';
import { InMemoryDb } from './in-memory.db';

@Module({
  exports: [InMemoryDb],
  providers: [InMemoryDb],
})
export class DbModule {}
