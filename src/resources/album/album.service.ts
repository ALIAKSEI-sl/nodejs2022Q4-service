import { forwardRef, Injectable, Inject } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { InMemoryDb } from '../../db/db.service.db';
import { AlbumEntity } from './entities/album.entity';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorMessages } from '../../helpers/responseMessages';
import { FavoritesService } from '../favorites/favorites.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class AlbumService {
  constructor(
    private db: InMemoryDb,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  create(createAlbumDto: CreateAlbumDto): AlbumEntity {
    const album = {
      id: uuidv4(), // uuid v4
      ...createAlbumDto,
    };

    this.db.albums.push(album);

    return album;
  }

  findAll(): AlbumEntity[] {
    const albums = this.db.albums;
    return albums;
  }

  findOne(id: string): AlbumEntity {
    const album = this.db.albums.find(({ id: albumId }) => albumId === id);
    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): AlbumEntity {
    const albumIndex = this.db.albums.findIndex(
      ({ id: albumId }) => albumId === id,
    );
    if (albumIndex === -1) {
      throw new HttpException(
        ErrorMessages.nonExistentAlbum,
        HttpStatus.NOT_FOUND,
      );
    }

    const album = Object.assign(this.db.albums[albumIndex], updateAlbumDto);

    return album;
  }

  remove(id: string): void {
    const albumIndex = this.db.albums.findIndex(
      ({ id: albumId }) => albumId === id,
    );
    if (albumIndex === -1) {
      throw new HttpException(
        ErrorMessages.nonExistentAlbum,
        HttpStatus.NOT_FOUND,
      );
    }

    this.db.albums.splice(albumIndex, 1);

    const removeAlbum = true;
    this.favoritesService.removeAlbum(id, removeAlbum);

    this.trackService.removeAlbumId(id);
  }

  removeArtistId(id: string): void {
    const albumIndex = this.db.albums.findIndex(
      (album) => album.artistId === id,
    );
    if (albumIndex !== -1) {
      this.db.albums[albumIndex].artistId = null;
    }
  }
}
