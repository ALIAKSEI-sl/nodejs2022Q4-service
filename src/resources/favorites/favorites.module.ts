import { forwardRef, Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from '../album/album.module';
import { TrackModule } from '../track/track.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesEntity } from './entities/favorites.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FavoritesEntity]),
    forwardRef(() => ArtistModule), //forwardRef устраняет циклические зависимости между модулями
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
  ],
  exports: [FavoritesService],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
