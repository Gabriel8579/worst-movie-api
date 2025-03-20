import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from 'src/domain/entities/movie/movie.entity';
import { MovieRepository } from 'src/domain/ports/movie/movie.repository';
import { MovieEntity } from './movie.typeorm.entity';
import { Repository } from 'typeorm';
import { ProducerEntity } from '../producer/producer.typeorm.entity';
import { StudioEntity } from '../studio/studio.typeorm.entity';
import { ProducerMovieEntity } from '../producer/producer-movie.typeorm.entity';
import { StudioMovieEntity } from '../studio/studio-movie.typeorm.entity';
import { v7 as uuidv7 } from 'uuid';

@Injectable()
export class MovieRepositoryImpl implements MovieRepository {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepository: Repository<MovieEntity>,
    @InjectRepository(ProducerEntity)
    private readonly producerRepository: Repository<ProducerEntity>,
    @InjectRepository(StudioEntity)
    private readonly studioRepository: Repository<StudioEntity>,
    @InjectRepository(ProducerMovieEntity)
    private readonly producerMovieRepository: Repository<ProducerMovieEntity>,
    @InjectRepository(StudioMovieEntity)
    private readonly studioMovieRepository: Repository<StudioMovieEntity>,
  ) {}

  private logger = new Logger(MovieRepositoryImpl.name);

  private producersCache: Map<string, number> = new Map();
  private studiosCache: Map<string, number> = new Map();

  findAll(): Promise<Movie[]> {
    throw new Error('Method not implemented.');
  }

  async getWinningMoviesByProducer(): Promise<{ [key: string]: number[] }> {
    const producerWins: { [key: string]: number[] } = {};

    const results = await this.producerMovieRepository
      .createQueryBuilder('pm')
      .innerJoinAndSelect('pm.movie', 'movie')
      .innerJoinAndSelect('pm.producer', 'producer')
      .where('movie.winner = :winner', { winner: true })
      .orderBy('movie.year', 'ASC')
      .select([
        'movie.year AS year',
        'producer.name AS producer, movie.winner as winner',
      ])
      .getRawMany<{ year: number; producer: string; winner: boolean }>();

    results.forEach(({ year, producer }) => {
      if (!producerWins[producer]) {
        producerWins[producer] = [];
      }
      producerWins[producer].push(year);
    });

    return producerWins;
  }

  async saveAll(movies: Movie[]): Promise<void> {
    try {
      this.logger.verbose(`Saving ${movies.length} movies`);
      const movieEntities = new Map<string, Movie>();
      movies.forEach((movie) => {
        const id = uuidv7();
        movieEntities.set(id, { ...movie, id });
      });

      const savedMovies = await this.movieRepository.insert(
        Array.from(movieEntities.values()),
      );

      const movieIdMap = savedMovies.identifiers.map((idObj, index) => ({
        id: idObj.id as string,
        movie: movieEntities.get(idObj.id as string),
        index,
      }));

      const producerInserts = [];
      const studioInserts = [];

      this.logger.verbose('Saving producers and studios');
      for (const { id: movieId, movie } of movieIdMap) {
        if (!movie) {
          this.logger.error(`Movie with id ${movieId} not found in map`);
          continue;
        }
        if (movie.producers) {
          for (const producer of movie.producers) {
            const producerId = await this.getProducerId(producer);
            producerInserts.push({ movieId, producerId });
          }
        }

        if (movie.studios) {
          for (const studio of movie.studios) {
            const studioId = await this.getStudioId(studio);
            studioInserts.push({ movieId, studioId });
          }
        }
      }

      this.logger.verbose('Saving producers and studios relationships');
      if (producerInserts.length > 0) {
        await this.producerMovieRepository.insert(producerInserts);
      }

      if (studioInserts.length > 0) {
        await this.studioMovieRepository.insert(studioInserts);
      }
      this.logger.verbose('Producers and studios relationships saved');
    } catch (error) {
      this.logger.error('Error saving movies', error);
    }
  }

  private async getProducerId(producerName: string): Promise<number> {
    this.logger.debug(`Getting producer id for ${producerName}`);
    if (this.producersCache.has(producerName)) {
      this.logger.debug(`Producer ${producerName} found in cache`);
      return this.producersCache.get(producerName) as number;
    }
    this.logger.debug(`Producer ${producerName} not found in cache`);

    this.logger.debug(`Searching for producer ${producerName} in database`);
    const producer = await this.producerRepository.findOne({
      where: { name: producerName },
    });

    if (!producer) {
      this.logger.debug(`Producer ${producerName} not found in database`);
      this.logger.debug(`Creating producer ${producerName}`);
      const newProducer = this.producerRepository.create({
        name: producerName,
      });
      await this.producerRepository.save(newProducer);
      this.logger.debug(
        `Producer ${producerName} created with id ${newProducer.id}`,
      );
      this.producersCache.set(producerName, newProducer.id);
      return newProducer.id;
    }

    this.logger.debug(`Producer ${producerName} found in database`);
    this.producersCache.set(producerName, producer.id);
    return producer.id;
  }

  private async getStudioId(studioName: string): Promise<number> {
    this.logger.debug(`Getting studio id for ${studioName}`);
    if (this.studiosCache.has(studioName)) {
      this.logger.debug(`Studio ${studioName} found in cache`);
      return this.studiosCache.get(studioName) as number;
    }
    this.logger.debug(`Studio ${studioName} not found in cache`);

    this.logger.debug(`Searching for studio ${studioName} in database`);
    const studio = await this.studioRepository.findOne({
      where: { name: studioName },
    });

    if (!studio) {
      this.logger.debug(`Studio ${studioName} not found in database`);
      this.logger.debug(`Creating studio ${studioName}`);
      const newStudio = this.studioRepository.create({
        name: studioName,
      });
      await this.studioRepository.save(newStudio);
      this.studiosCache.set(studioName, newStudio.id);
      this.logger.debug(`Studio ${studioName} created with id ${newStudio.id}`);
      return newStudio.id;
    }

    this.logger.debug(`Studio ${studioName} found in database`);
    this.studiosCache.set(studioName, studio.id);
    return studio.id;
  }
}
