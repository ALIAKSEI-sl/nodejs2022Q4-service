import { AlbumEntity } from 'src/resources/album/entities/album.entity';
import { ArtistEntity } from 'src/resources/artist/entities/artist.entity';
import { TrackEntity } from 'src/resources/track/entities/track.entity';
import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity('favorites')
export class FavoritesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => TrackEntity, (track) => track, { cascade: true })
  @JoinTable()
  tracks: TrackEntity[];

  @ManyToMany(() => AlbumEntity, (album) => album, { cascade: true })
  @JoinTable()
  albums: AlbumEntity[];

  @ManyToMany(() => ArtistEntity, (artist) => artist, { cascade: true })
  @JoinTable()
  artists: ArtistEntity[];
}
