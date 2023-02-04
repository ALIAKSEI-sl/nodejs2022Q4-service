import { AlbumEntity } from 'src/resources/album/entities/album.entity';
import { ArtistEntity } from 'src/resources/artist/entities/artist.entity';
import { TrackEntity } from 'src/resources/track/entities/track.entity';

export class FavoritesEntity {
  artists: ArtistEntity[];
  albums: AlbumEntity[];
  tracks: TrackEntity[];
}
