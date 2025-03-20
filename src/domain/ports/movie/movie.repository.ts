import { Movie } from 'src/domain/entities/movie/movie.entity';

export const MOVIE_REPOSITORY = 'MovieRepository';

export interface MovieRepository {
  findAll(): Promise<Movie[]>;
  saveAll(movies: Movie[]): Promise<void>;
  getWinningMoviesByProducer(): Promise<{ [key: string]: number[] }>;
}
