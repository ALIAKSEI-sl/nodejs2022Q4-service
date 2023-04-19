import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsOptional()
  @IsString()
  artistId: string | null; // refers to Artist
}
