import { Injectable } from '@nestjs/common';
import Album from '../resources/album/model/album.model';
import Artist from '../resources/artist/model/artist.model';
import Favorites from '../resources/favorites/model/favorites.model';
import Track from '../resources/track/model/track.model';
import User from '../resources/user/model/user.model';

@Injectable()
export class InMemoryDb {
  artists: Artist[] = [];
  tracks: Track[] = [];
  albums: Album[] = [];
  users: User[] = [];
  favorites: Favorites = {
    artists: [],
    tracks: [],
    albums: [],
  };
}
