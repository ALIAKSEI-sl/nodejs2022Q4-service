import { DataSource } from 'typeorm';
import { UserEntity } from './resources/user/entities/user.entity';
import { AlbumEntity } from './resources/album/entities/album.entity';
import { ArtistEntity } from './resources/artist/entities/artist.entity';
import { TrackEntity } from './resources/track/entities/track.entity';
import { FavoritesEntity } from './resources/favorites/entities/favorites.entity';
import { homeLibraryServer1677507773810 } from './migration/1677507773810-homeLibraryServer';
import 'dotenv/config';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: false,
  logging: false,
  entities: [
    UserEntity,
    AlbumEntity,
    ArtistEntity,
    TrackEntity,
    FavoritesEntity,
  ],
  subscribers: [],
  migrations: [homeLibraryServer1677507773810],
});
