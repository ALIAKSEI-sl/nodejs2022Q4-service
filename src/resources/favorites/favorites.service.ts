import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { FavoritesEntity } from './entities/favorites.entity';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { TrackService } from '../track/track.service';
import { createHttpException } from '../../helpers/createHttpException';
import { ErrorMessages } from '../../helpers/responseMessages';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    const findOneOptions = {
      relations: {
        albums: true,
        artists: true,
        tracks: true,
      },
    };
    const repository = await this.favoritesRepository.find(findOneOptions);

    if (repository.length === 0) {
      const createdFavorites = this.favoritesRepository.create();
      await this.favoritesRepository.save(createdFavorites);

      const repositoryFavorites = await this.favoritesRepository.find(
        findOneOptions,
      );
      return repositoryFavorites[0];
    } else {
      return repository[0];
    }
  }

  async findAll() {
    const repositoryFavorites = await this.getFavoritesRepository();

    return repositoryFavorites;
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
    repository.tracks.push(track);
    await this.favoritesRepository.save(repository);
    return { message: 'Track added to favorites' };
  }

  async removeTrack(id: string, removeTrack = false): Promise<void> {
    const repository = await this.getFavoritesRepository();
    const trackIndex = repository.tracks.find((track) => track.id === id);

    if (trackIndex === undefined) {
      if (!removeTrack) {
        createHttpException(
          ErrorMessages.nonExistentTrack,
          HttpStatus.NOT_FOUND,
        );
      }
    } else {
      repository.tracks = repository.tracks.filter((track) => track.id !== id);
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
    repository.albums.push(album);
    await this.favoritesRepository.save(repository);
    return { message: 'Album added to favorites' };
  }

  async removeAlbum(id: string, removeAlbum = false): Promise<void> {
    const repository = await this.getFavoritesRepository();
    const album = repository.albums.find((album) => album.id === id);
    if (album === undefined) {
      if (!removeAlbum) {
        createHttpException(
          ErrorMessages.nonExistentAlbum,
          HttpStatus.NOT_FOUND,
        );
      }
    } else {
      repository.albums = repository.albums.filter((album) => album.id !== id);
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
    repository.artists.push(artist);
    await this.favoritesRepository.save(repository);
    return { message: 'Artist added to favorites' };
  }

  async removeArtist(id: string, removeArtist = false): Promise<void> {
    const repository = await this.getFavoritesRepository();
    const artist = repository.artists.find((artist) => artist.id === id);
    if (artist === undefined) {
      if (!removeArtist) {
        createHttpException(
          ErrorMessages.nonExistentArtist,
          HttpStatus.NOT_FOUND,
        );
      }
    } else {
      repository.artists = repository.artists.filter(
        (artist) => artist.id !== id,
      );
      await this.favoritesRepository.save(repository);
    }
  }
}
