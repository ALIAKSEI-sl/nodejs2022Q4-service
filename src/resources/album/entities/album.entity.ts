export class AlbumEntity {
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}
