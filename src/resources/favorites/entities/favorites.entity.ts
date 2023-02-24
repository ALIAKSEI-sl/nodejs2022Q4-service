import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('favorites')
export class FavoritesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { array: true })
  artists: string[];

  @Column('text', { array: true })
  albums: string[];

  @Column('text', { array: true })
  tracks: string[];
}
