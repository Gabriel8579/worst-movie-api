import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { MovieEntity } from '../movie/movie.typeorm.entity';
import { ProducerEntity } from './producer.typeorm.entity';

@Entity('producers_movies')
export class ProducerMovieEntity {
  @PrimaryColumn()
  declare producerId: number;

  @PrimaryColumn()
  declare movieId: string;

  @OneToOne(() => MovieEntity)
  @JoinColumn({ name: 'movieId', referencedColumnName: 'id' })
  movie: MovieEntity;

  @OneToOne(() => ProducerEntity)
  @JoinColumn({ name: 'producerId', referencedColumnName: 'id' })
  producer: ProducerEntity;
}
