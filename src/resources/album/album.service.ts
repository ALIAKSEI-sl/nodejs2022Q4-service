import { forwardRef, Injectable, Inject } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from './entities/album.entity';
import { HttpStatus } from '@nestjs/common';
import { createHttpException } from '../../helpers/createHttpException';
import { ErrorMessages } from '../../helpers/responseMessages';
import { FavoritesService } from '../favorites/favorites.service';
import { TrackService } from '../track/track.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
    @Inject(forwardRef(() => TrackService))
    private trackService: TrackService,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<AlbumEntity> {
    const createdAlbum = this.albumRepository.create({ ...createAlbumDto });
    const savedAlbum = await this.albumRepository.save(createdAlbum);

    return savedAlbum;
  }

  async findAll(): Promise<AlbumEntity[]> {
    const albums = await this.albumRepository.find();
    return albums;
  }

  async findOne(id: string): Promise<AlbumEntity> | null {
    const album = await this.albumRepository.findOne({ where: { id } });
    return album;
  }

  async update(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<AlbumEntity> {
    const album = await this.albumRepository.findOne({ where: { id } });
    if (album === null) {
      createHttpException(ErrorMessages.nonExistentAlbum, HttpStatus.NOT_FOUND);
    }

    const updatedAlbum = Object.assign(album, updateAlbumDto);
    const savedAlbum = await this.albumRepository.save(updatedAlbum);
    return savedAlbum;
  }

  async remove(id: string): Promise<void> {
    const deletedAlbum = await this.albumRepository.delete(id);
    if (deletedAlbum.affected === 0) {
      createHttpException(ErrorMessages.nonExistentAlbum, HttpStatus.NOT_FOUND);
    }
  }
}
