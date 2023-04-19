import { AlbumEntity } from 'src/resources/album/entities/album.entity';
import { ArtistEntity } from 'src/resources/artist/entities/artist.entity';
import { TrackEntity } from 'src/resources/track/entities/track.entity';

export default interface Favorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

export interface FavoritesResponse {
  albums: AlbumEntity[];
  artists: ArtistEntity[];
  tracks: TrackEntity[];
}
