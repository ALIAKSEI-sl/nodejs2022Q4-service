import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackEntity } from './entities/track.entity';
import { createHttpException } from '../../helpers/createHttpException';
import { HttpStatus } from '@nestjs/common';
import { ErrorMessages } from '../../helpers/responseMessages';
import { FavoritesService } from '../favorites/favorites.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(TrackEntity)
    private trackRepository: Repository<TrackEntity>,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<TrackEntity> {
    const createdTrack = this.trackRepository.create({ ...createTrackDto });
    const savedTrack = await this.trackRepository.save(createdTrack);
    return savedTrack;
  }

  async findAll(): Promise<TrackEntity[]> {
    const tracks = await this.trackRepository.find();
    return tracks;
  }

  async findOne(id: string): Promise<TrackEntity> | null {
    const track = await this.trackRepository.findOne({ where: { id } });
    return track;
  }

  async update(
    id: string,
    updateTrackDto: UpdateTrackDto,
  ): Promise<TrackEntity> {
    const track = await this.trackRepository.findOne({ where: { id } });
    if (track === null) {
      createHttpException(ErrorMessages.nonExistentTrack, HttpStatus.NOT_FOUND);
    }

    const updatedTrack = Object.assign(track, updateTrackDto);
    const savedTrack = await this.trackRepository.save(updatedTrack);
    return savedTrack;
  }

  async remove(id: string): Promise<void> {
    const deletedTrack = await this.trackRepository.delete(id);
    if (deletedTrack.affected === 0) {
      createHttpException(ErrorMessages.nonExistentTrack, HttpStatus.NOT_FOUND);
    }
  }
}
