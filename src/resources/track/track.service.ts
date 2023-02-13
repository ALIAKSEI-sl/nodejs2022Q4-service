import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { InMemoryDb } from '../../db/db.service.db';
import { v4 as uuidv4 } from 'uuid';
import { TrackEntity } from './entities/track.entity';
import { createHttpException } from '../../helpers/createHttpException';
import { HttpStatus } from '@nestjs/common';
import { ErrorMessages } from '../../helpers/responseMessages';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TrackService {
  constructor(
    private db: InMemoryDb,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  create(createTrackDto: CreateTrackDto): TrackEntity {
    const track = {
      id: uuidv4(), // uuid v4
      ...createTrackDto,
    };

    this.db.tracks.push(track);
    return track;
  }

  findAll(): TrackEntity[] {
    const tracks = this.db.tracks;
    return tracks;
  }

  findOne(id: string): TrackEntity {
    const track = this.db.tracks.find(({ id: trackId }) => trackId === id);
    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): TrackEntity {
    const trackIndex = this.db.tracks.findIndex(
      ({ id: trackId }) => trackId === id,
    );
    if (trackIndex === -1) {
      createHttpException(ErrorMessages.nonExistentTrack, HttpStatus.NOT_FOUND);
    }

    const track = Object.assign(this.db.tracks[trackIndex], updateTrackDto);
    return track;
  }

  remove(id: string): void {
    const trackIndex = this.db.tracks.findIndex(
      ({ id: trackId }) => trackId === id,
    );
    if (trackIndex === -1) {
      createHttpException(ErrorMessages.nonExistentTrack, HttpStatus.NOT_FOUND);
    }

    this.db.tracks.splice(trackIndex, 1);

    const removeTrack = true;
    this.favoritesService.removeTrack(id, removeTrack);
  }

  removeArtistId(id: string) {
    const trackIndex = this.db.tracks.findIndex(
      (track) => track.artistId === id,
    );
    if (trackIndex !== -1) {
      this.db.tracks[trackIndex].artistId = null;
    }
  }

  removeAlbumId(id: string) {
    const trackIndex = this.db.tracks.findIndex(
      (track) => track.albumId === id,
    );
    if (trackIndex !== -1) {
      this.db.tracks[trackIndex].albumId = null;
    }
  }
}
