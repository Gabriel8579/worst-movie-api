import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fastCsv from 'fast-csv';
import { createReadStream } from 'node:fs';
import { MovieCsvHeaders } from 'src/domain/entities/movie/movie.csv';
import { Movie } from 'src/domain/entities/movie/movie.entity';
import { MovieCsvReader } from 'src/domain/ports/movie/movie-csv-reader.interface';
import { MovieRepository } from 'src/domain/ports/movie/movie.repository';
import { ConfigSchema } from 'src/infrastructure/config/configuration';
import { splitNames } from 'src/utils/splitName';

@Injectable()
export class MovieFastCsvLoader extends MovieCsvReader {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly configService: ConfigService<ConfigSchema>,
  ) {
    super();
  }

  private logger = new Logger(MovieFastCsvLoader.name);

  read(filePath: string): Promise<void> {
    const batchSize = this.configService.get<number>('sql_batch_size') || 900;

    const stream = createReadStream(filePath, { encoding: 'utf-8' });
    const movies: Movie[] = [];

    const startedAt = Date.now();

    this.logger.log(`Reading file ${filePath}`);

    return new Promise((resolve) => {
      stream
        .pipe(fastCsv.parse({ headers: true, delimiter: ';' }))
        .on('data', (row: MovieCsvHeaders) => {
          const movie = {
            year: Number(row.year),
            title: row.title,
            studios: splitNames(row.studios),
            producers: splitNames(row.producers),
            winner: row.winner === 'yes',
          } as Movie;
          movies.push(movie);

          if (movies.length >= batchSize) {
            this.saveBatch(movies)
              .then(() => {
                this.logger.log(
                  `Saved batch of ${movies.length} movies in ${Date.now() - startedAt}ms`,
                );
              })
              .catch((err) => {
                this.logger.error('Error saving batch of movies', err);
                throw err;
              });
            movies.length = 0; // Clear the batch
          }
        })
        .on('end', () => {
          this.logger.log(
            `Finished reading file ${filePath} in ${Date.now() - startedAt}ms`,
          );
          if (movies.length > 0) {
            this.saveBatch(movies)
              .then(() => {
                this.logger.log(
                  `Saved remaining ${movies.length} movies in ${Date.now() - startedAt}ms`,
                );
                resolve();
              })
              .catch((err) => {
                this.logger.error('Error saving remaining movies', err);
                throw err;
              });
          } else {
            resolve();
          }
        });
    });
  }

  private saveBatch(movies: Movie[]): Promise<void> {
    return this.movieRepository.saveAll(movies);
  }
}
