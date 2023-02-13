import { forwardRef, Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { DbModule } from 'src/db/db.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
  imports: [DbModule, forwardRef(() => FavoritesModule)],
  exports: [TrackService],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
