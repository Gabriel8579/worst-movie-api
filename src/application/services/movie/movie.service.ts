import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { MovieCsvReader } from 'src/domain/ports/movie/movie-csv-reader.interface';
import {
  MOVIE_REPOSITORY,
  MovieRepository,
} from 'src/domain/ports/movie/movie.repository';

@Injectable()
export class MovieService implements OnApplicationBootstrap {
  constructor(
    @Inject(MOVIE_REPOSITORY) private readonly movieRepository: MovieRepository,
    private readonly movieCsvReader: MovieCsvReader,
  ) {}

  async onApplicationBootstrap() {
    await this.movieCsvReader.read('data/movielist.csv');
  }
}
