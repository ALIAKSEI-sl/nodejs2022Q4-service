import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FavoritesEntity } from './entities/favorites.entity';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { TrackService } from '../track/track.service';
import { createHttpException } from '../../helpers/createHttpException';
import { ErrorMessages } from '../../helpers/responseMessages';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoritesResponse } from './model/favorites.model';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(FavoritesEntity)
    private favoritesRepository: Repository<FavoritesEntity>,
    @Inject(forwardRef(() => AlbumService))
    private albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private artistService: ArtistService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  async getFavoritesRepository() {
    const repository = await this.favoritesRepository.find();
    if (repository.length === 0) {
      const createdFavorites = this.favoritesRepository.create();
      createdFavorites.albums = [];
      createdFavorites.artists = [];
      createdFavorites.tracks = [];

      const savedFavorites = await this.favoritesRepository.save(
        createdFavorites,
      );
      return savedFavorites;
    } else {
      return repository[0];
    }
  }

  async findAll(): Promise<FavoritesResponse> {
    const { albums, artists, tracks } = await this.getFavoritesRepository();

    const favoritesAlbums = (
      await Promise.all(
        albums.map(async (id) => await this.albumService.findOne(id)),
      )
    ).filter((album) => album);

    const favoritesArtists = (
      await Promise.all(
        artists.map(async (id) => await this.artistService.findOne(id)),
      )
    ).filter((artist) => artist);

    const favoritesTracks = (
      await Promise.all(
        tracks.map(async (id) => await this.trackService.findOne(id)),
      )
    ).filter((track) => track);

    const favorites: FavoritesResponse = {
      albums: favoritesAlbums,
      artists: favoritesArtists,
      tracks: favoritesTracks,
    };

    return favorites;
  }

  async addTrack(id: string): Promise<{ message: string }> {
    const track = await this.trackService.findOne(id);
    if (track === null) {
      createHttpException(
        ErrorMessages.nonExistentTrack,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const repository = await this.getFavoritesRepository();
    repository.tracks.push(id);
    await this.favoritesRepository.save(repository);
    return { message: 'Track added to favorites' };
  }

  async removeTrack(id: string, removeTrack = false): Promise<void> {
    const repository = await this.getFavoritesRepository();
    const trackIndex = repository.tracks.findIndex((trackId) => trackId === id);

    if (trackIndex === -1) {
      if (!removeTrack) {
        createHttpException(
          ErrorMessages.nonExistentTrack,
          HttpStatus.NOT_FOUND,
        );
      }
    } else {
      repository.tracks.splice(trackIndex, 1);
      await this.favoritesRepository.save(repository);
    }
  }

  async addAlbum(id: string): Promise<{ message: string }> {
    const album = await this.albumService.findOne(id);
    if (album === null) {
      createHttpException(
        ErrorMessages.nonExistentUser,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const repository = await this.getFavoritesRepository();
    repository.albums.push(id);
    await this.favoritesRepository.save(repository);
    return { message: 'Album added to favorites' };
  }

  async removeAlbum(id: string, removeAlbum = false): Promise<void> {
    const repository = await this.getFavoritesRepository();
    const albumIndex = repository.albums.findIndex((albumId) => albumId === id);
    if (albumIndex === -1) {
      if (!removeAlbum) {
        createHttpException(
          ErrorMessages.nonExistentAlbum,
          HttpStatus.NOT_FOUND,
        );
      }
    } else {
      repository.albums.splice(albumIndex, 1);
      await this.favoritesRepository.save(repository);
    }
  }

  async addArtist(id: string): Promise<{ message: string }> {
    const artist = await this.artistService.findOne(id);
    if (artist === null) {
      createHttpException(
        ErrorMessages.nonExistentUser,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const repository = await this.getFavoritesRepository();
    repository.artists.push(id);
    await this.favoritesRepository.save(repository);
    return { message: 'Artist added to favorites' };
  }

  async removeArtist(id: string, removeArtist = false): Promise<void> {
    const repository = await this.getFavoritesRepository();
    const artistIndex = repository.artists.findIndex(
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
      repository.artists.splice(artistIndex, 1);
      await this.favoritesRepository.save(repository);
    }
  }
}
