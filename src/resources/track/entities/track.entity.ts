import { AlbumEntity } from 'src/resources/album/entities/album.entity';
import { ArtistEntity } from 'src/resources/artist/entities/artist.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity('track')
export class TrackEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string; // uuid v4

  @Column()
  name: string;

  @Column({ nullable: true })
  artistId: string | null; // refers to Artist

  //track содержит один экземпляр artist
  @ManyToOne(() => ArtistEntity, (artist) => artist.id, {
    nullable: true,
    onDelete: 'SET NULL', //при удалении artist установить Null
  })
  artist: ArtistEntity;

  @Column({ nullable: true })
  albumId: string | null; // refers to Album

  //track содержит один экземпляр album
  @ManyToOne(() => AlbumEntity, (album) => album.id, {
    nullable: true,
    onDelete: 'SET NULL', //при удалении album установить Null
  })
  album: AlbumEntity;

  @Column()
  duration: number; // integer number
}
