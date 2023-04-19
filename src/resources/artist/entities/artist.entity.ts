import { AlbumEntity } from 'src/resources/album/entities/album.entity';
import { TrackEntity } from 'src/resources/track/entities/track.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('artist')
export class ArtistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  //artist содержит несколько экземпляров track
  @OneToMany(() => TrackEntity, (track) => track.artistId)
  tracks: TrackEntity[];

  //artist содержит несколько экземпляров album
  @OneToMany(() => AlbumEntity, (album) => album.artistId)
  artist: AlbumEntity[];
}
