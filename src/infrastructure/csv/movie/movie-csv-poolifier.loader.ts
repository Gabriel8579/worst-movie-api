import { Injectable, Logger } from '@nestjs/common';
import { MovieCsvReader } from 'src/domain/ports/movie/movie-csv-reader.interface';
import { MovieRepository } from 'src/domain/ports/movie/movie.repository';
import { FixedThreadPool } from 'poolifier';
import { createReadStream, existsSync } from 'node:fs';
import { createInterface } from 'node:readline';
import { Movie } from 'src/domain/entities/movie/movie.entity';
import * as path from 'node:path';
import { ConfigService } from '@nestjs/config';
import { ConfigSchema } from 'src/infrastructure/config/configuration';

@Injectable()
export class MovieCsvPoolifierLoader extends MovieCsvReader {
  private readonly pool: FixedThreadPool<string[], Movie[]>;

  private logger = new Logger(MovieCsvPoolifierLoader.name);

  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly configService: ConfigService<ConfigSchema>,
  ) {
    super();

    const workers = this.configService.get<number>('workers_pool_size') || 4;

    this.logger.verbose('Starting workers');
    this.pool = new FixedThreadPool<string[], Movie[]>(
      workers,
      path.resolve(
        __dirname,
        '../../../../dist/infrastructure/workers/movie/movie-csv.worker.js',
      ),
    );
    this.logger.verbose(`${workers} Workers started`);
  }

  async read(filePath: string): Promise<void> {
    if (!filePath) throw new Error('File path is required');

    const realPath = path.resolve(__dirname, '../../../../', filePath);

    if (!existsSync(realPath)) {
      throw new Error(`File ${realPath} does not exist`);
    }

    const startedAt = Date.now();

    this.logger.log(`Reading file ${realPath}`);
    const stream = createReadStream(realPath, { encoding: 'utf-8' });
    const rlInterface = createInterface({ input: stream, crlfDelay: Infinity });

    const batchSize =
      this.configService.get<number>('workers_batch_size') || 50;
    const batch: string[] = [];
    const promises: Promise<void>[] = [];

    let header: string | null = null;
    for await (const line of rlInterface) {
      if (!header) {
        header = line;
        continue;
      }

      batch.push(line);

      if (batch.length >= batchSize) {
        promises.push(this.sendToPool([header, ...batch]));
        batch.length = 0;
      }
    }

    if (batch.length > 0) {
      promises.push(this.sendToPool([header as string, ...batch]));
    }

    await Promise.allSettled(promises);

    this.logger.log(
      `Finished reading file ${filePath} in ${Date.now() - startedAt}ms`,
    );
    this.logger.verbose(`Processed ${promises.length} batches`);
    this.logger.verbose('Stopping workers');
    await this.pool.destroy();
    this.logger.verbose('Workers stopped');
  }

  private async sendToPool(batch: string[]): Promise<void> {
    try {
      this.logger.verbose(`Sending batch of ${batch.length} to pool`);
      const movies = await this.pool.execute(batch);
      this.logger.verbose(`Received ${movies.length} movies from pool`);

      const sqlBatchSize =
        this.configService.get<number>('sql_batch_size') || 1000;

      this.logger.verbose(
        `Saving batch of ${sqlBatchSize}/${movies.length} movies`,
      );

      while (movies.length > sqlBatchSize) {
        const batch = movies.splice(0, sqlBatchSize);
        await this.movieRepository.saveAll(batch);
        this.logger.verbose(`Saved batch of ${batch.length} movies`);
      }

      return await this.movieRepository.saveAll(movies);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
