import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { InMemoryDb } from '../../db/db.service.db';
import { ArtistEntity } from './entities/artist.entity';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorMessages } from '../../helpers/responseMessages';
import { FavoritesService } from '../favorites/favorites.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class ArtistService {
  constructor(
    private db: InMemoryDb,
    private favoritesService: FavoritesService,
    private albumService: AlbumService,
    private trackService: TrackService,
  ) {}
  create(createArtistDto: CreateArtistDto): ArtistEntity {
    const artist = {
      id: uuidv4(), // uuid v4
      ...createArtistDto,
    };

    this.db.artists.push(artist);

    return artist;
  }

  findAll(): ArtistEntity[] {
    const artists = this.db.artists;
    return artists;
  }

  findOne(id: string): ArtistEntity {
    const artist = this.db.artists.find(
      ({ id: artistsId }) => artistsId === id,
    );
    if (!artist) {
      throw new HttpException(
        ErrorMessages.nonExistentUser,
        HttpStatus.NOT_FOUND,
      );
    }

    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): ArtistEntity {
    const artistIndex = this.db.tracks.findIndex(
      ({ id: artistId }) => artistId === id,
    );
    if (artistIndex === -1) {
      throw new HttpException(
        ErrorMessages.nonExistentArtist,
        HttpStatus.NOT_FOUND,
      );
    }

    const artist = Object.assign(this.db.artists[artistIndex], updateArtistDto);
    return artist;
  }

  remove(id: string): void {
    const artistIndex = this.db.artists.findIndex(
      ({ id: artistId }) => artistId === id,
    );
    if (artistIndex === -1) {
      throw new HttpException(
        ErrorMessages.nonExistentArtist,
        HttpStatus.NOT_FOUND,
      );
    }

    this.db.artists.splice(artistIndex, 1);

    this.favoritesService.removeArtist(id);

    this.albumService.removeArtistId(id);
    this.trackService.removeArtistId(id);
  }
}
