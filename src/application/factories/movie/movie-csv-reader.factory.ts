import { ConfigService } from '@nestjs/config';
import { MovieCsvReader } from 'src/domain/ports/movie/movie-csv-reader.interface';
import { MovieRepository } from 'src/domain/ports/movie/movie.repository';
import { ConfigSchema } from 'src/infrastructure/config/configuration';
import { MovieCsvPoolifierLoader } from 'src/infrastructure/csv/movie/movie-csv-poolifier.loader';
import { MovieFastCsvLoader } from 'src/infrastructure/csv/movie/movie-fast-csv.loader';

export const movieCsvReaderFactory = (
  configService: ConfigService<ConfigSchema>,
  movieRepository: MovieRepository,
): MovieCsvReader => {
  const csvLoader: string = configService.get<string>('csvLoader', 'worker');
  if (csvLoader === 'worker') {
    return new MovieCsvPoolifierLoader(movieRepository, configService);
  } else if (csvLoader === 'fastcsv') {
    return new MovieFastCsvLoader(movieRepository, configService);
  } else {
    throw new Error(`Invalid CSV loader: ${csvLoader}`);
  }
};
