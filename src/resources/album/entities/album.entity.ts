import { ArtistEntity } from 'src/resources/artist/entities/artist.entity';
import { TrackEntity } from 'src/resources/track/entities/track.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity('album')
export class AlbumEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  year: number;

  @Column({ nullable: true })
  artistId: string | null; // refers to Artist

  //album содержит несколько экземпляров track
  @OneToMany(() => TrackEntity, (track) => track.albumId)
  tracks: TrackEntity[];

  //album содержит один экземпляр artist
  @ManyToOne(() => ArtistEntity, (artist) => artist.id, {
    nullable: true,
    onDelete: 'SET NULL', //при удалении артиста установить Null
  })
  artist: ArtistEntity;
}
