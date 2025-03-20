import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { movieCsvReaderFactory } from 'src/application/factories/movie/movie-csv-reader.factory';
import { MovieCsvReader } from 'src/domain/ports/movie/movie-csv-reader.interface';
import { ConfigSchema } from 'src/infrastructure/config/configuration';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { MovieService } from './movie.service';
import {
  MOVIE_REPOSITORY,
  MovieRepository,
} from 'src/domain/ports/movie/movie.repository';

@Module({
  imports: [DatabaseModule],
  providers: [
    MovieService,
    {
      provide: MovieCsvReader,
      useFactory: (
        config: ConfigService<ConfigSchema>,
        movieRepository: MovieRepository,
      ) => movieCsvReaderFactory(config, movieRepository),
      inject: [ConfigService<ConfigSchema>, MOVIE_REPOSITORY],
    },
  ],
  exports: [MovieService],
})
export class MovieModule {}
