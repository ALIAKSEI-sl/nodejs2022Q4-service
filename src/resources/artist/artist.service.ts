import { forwardRef, Injectable, Inject } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistEntity } from './entities/artist.entity';
import { HttpStatus } from '@nestjs/common';
import { createHttpException } from '../../helpers/createHttpException';
import { ErrorMessages } from '../../helpers/responseMessages';
import { FavoritesService } from '../favorites/favorites.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistEntity)
    private albumRepository: Repository<ArtistEntity>,
    @Inject(forwardRef(() => FavoritesService))
    private favoritesService: FavoritesService,
    @Inject(forwardRef(() => AlbumService)) private albumService: AlbumService,
    @Inject(forwardRef(() => TrackService)) private trackService: TrackService,
  ) {}

  async create(createArtistDto: CreateArtistDto): Promise<ArtistEntity> {
    const artist = this.albumRepository.create(createArtistDto);
    const savedArtist = await this.albumRepository.save(artist);
    return savedArtist;
  }

  async findAll(): Promise<ArtistEntity[]> {
    const artists = await this.albumRepository.find();
    return artists;
  }

  async findOne(id: string): Promise<ArtistEntity> | null {
    const artist = await this.albumRepository.findOne({ where: { id } });
    return artist;
  }

  async update(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<ArtistEntity> {
    const artist = await this.albumRepository.findOne({ where: { id } });
    if (artist === null) {
      createHttpException(
        ErrorMessages.nonExistentArtist,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedArtist = Object.assign(artist, updateArtistDto);
    const savedArtist = await this.albumRepository.save(updatedArtist);
    return savedArtist;
  }

  async remove(id: string): Promise<void> {
    const deletedArtist = await this.albumRepository.delete(id);
    if (deletedArtist.affected === 0) {
      createHttpException(
        ErrorMessages.nonExistentArtist,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
