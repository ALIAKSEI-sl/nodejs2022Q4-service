import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InMemoryDb } from '../../db/db.service.db';
import { FavoritesEntity } from './entities/favorites.entity';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { TrackService } from '../track/track.service';
import { createHttpException } from '../../helpers/createHttpException';
import { ErrorMessages } from 'src/helpers/responseMessages';

@Injectable()
export class FavoritesService {
  constructor(
    private db: InMemoryDb,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  findAll(): FavoritesEntity {
    const { albums, artists, tracks } = this.db.favorites;

    const favorites = new FavoritesEntity();
    favorites.albums = [];
    favorites.artists = [];
    favorites.tracks = [];

    albums.forEach((id) => {
      const album = this.db.albums.find((album) => album.id === id);
      favorites.albums.push(album);
    });

    artists.forEach((id) => {
      const artist = this.db.artists.find((artist) => artist.id === id);
      favorites.artists.push(artist);
    });

    tracks.forEach((id) => {
      const track = this.db.tracks.find((track) => track.id === id);
      favorites.tracks.push(track);
    });

    return favorites;
  }

  addTrack(id: string): { message: string } {
    const track = this.trackService.findOne(id);
    if (track === undefined) {
      createHttpException(
        ErrorMessages.nonExistentTrack,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    this.db.favorites.tracks.push(id);
    return { message: 'Track added to favorites' };
  }

  removeTrack(id: string, removeTrack = false): void {
    const trackIndex = this.db.favorites.tracks.findIndex(
      (trackId) => trackId === id,
    );

    if (trackIndex === -1) {
      if (!removeTrack) {
        createHttpException(
          ErrorMessages.nonExistentTrack,
          HttpStatus.NOT_FOUND,
        );
      }
    } else {
      this.db.favorites.tracks.splice(trackIndex, 1);
    }
  }

  addAlbum(id: string): { message: string } {
    const album = this.albumService.findOne(id);
    if (album === undefined) {
      createHttpException(
        ErrorMessages.nonExistentUser,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    this.db.favorites.albums.push(id);
    return { message: 'Album added to favorites' };
  }

  removeAlbum(id: string, removeAlbum = false): void {
    const albumIndex = this.db.favorites.albums.findIndex(
      (albumId) => albumId === id,
    );
    if (albumIndex === -1) {
      if (!removeAlbum) {
        createHttpException(
          ErrorMessages.nonExistentAlbum,
          HttpStatus.NOT_FOUND,
        );
      }
    } else {
      this.db.favorites.albums.splice(albumIndex, 1);
    }
  }

  addArtist(id: string): { message: string } {
    const artist = this.artistService.findOne(id);
    if (artist === undefined) {
      createHttpException(
        ErrorMessages.nonExistentUser,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    this.db.favorites.artists.push(id);
    return { message: 'Artist added to favorites' };
  }

  removeArtist(id: string, removeArtist = false) {
    const artistIndex = this.db.favorites.artists.findIndex(
      (artistId) => artistId === id,
    );
    if (artistIndex === -1) {
      if (!removeArtist) {
        createHttpException(
          ErrorMessages.nonExistentArtist,
          HttpStatus.NOT_FOUND,
        );
      }
    } else {
      this.db.favorites.artists.splice(artistIndex, 1);
    }
  }
}
