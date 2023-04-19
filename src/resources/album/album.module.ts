import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { DbModule } from 'src/db/db.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { TrackModule } from '../track/track.module';

@Module({
  imports: [
    DbModule,
    forwardRef(() => TrackModule),
    forwardRef(() => FavoritesModule),
  ],
  exports: [AlbumService], // экспорт album service
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
