import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class TrackDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  posterPath: string;

  @IsNotEmpty()
  @IsString()
  trackPath: string;

  @IsNotEmpty()
  @IsString()
  groupId: string;

  @IsNotEmpty()
  @IsString()
  albumId: string;

  @IsNotEmpty({ each: true })
  @IsArray()
  @IsString({ each: true })
  genreIds: string[];
}
