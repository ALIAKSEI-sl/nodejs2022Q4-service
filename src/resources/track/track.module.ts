import { forwardRef, Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { DbModule } from 'src/db/db.module';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { FavoritesService } from '../favorites/favorites.service';

@Module({
  imports: [
    DbModule,
    forwardRef(() => ArtistService),
    forwardRef(() => AlbumService),
    forwardRef(() => FavoritesService),
  ],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
