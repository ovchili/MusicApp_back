import { IsNotEmpty, IsString } from 'class-validator';

export class AlbumDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  posterPath: string;

  @IsNotEmpty()
  @IsString()
  groupId: string;
}
