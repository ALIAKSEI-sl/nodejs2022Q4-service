import { forwardRef, Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { DbModule } from 'src/db/db.module';
import { ArtistModule } from '../artist/artist.module';
import { FavoritesModule } from '../favorites/favorites.module';
import { TrackModule } from '../track/track.module';

@Module({
  imports: [
    DbModule,
    forwardRef(() => ArtistModule),
    forwardRef(() => FavoritesModule),
    forwardRef(() => TrackModule),
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
