import { Entity, PrimaryColumn } from 'typeorm';

@Entity('studios_movies')
export class StudioMovieEntity {
  @PrimaryColumn()
  declare studioId: number;

  @PrimaryColumn()
  declare movieId: string;
}
