import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MOVIE_REPOSITORY } from '../../domain/ports/movie/movie.repository';
import { MovieRepositoryImpl } from './movie/movie.repository.impl';
import { MovieEntity } from './movie/movie.typeorm.entity';
import { ProducerEntity } from './producer/producer.typeorm.entity';
import { StudioEntity } from './studio/studio.typeorm.entity';
import { ProducerMovieEntity } from './producer/producer-movie.typeorm.entity';
import { StudioMovieEntity } from './studio/studio-movie.typeorm.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MovieEntity,
      ProducerEntity,
      StudioEntity,
      ProducerMovieEntity,
      StudioMovieEntity,
    ]),
  ],
  providers: [{ provide: MOVIE_REPOSITORY, useClass: MovieRepositoryImpl }],
  exports: [MOVIE_REPOSITORY],
})
export class DatabaseModule {}
