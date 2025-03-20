import { Movie } from 'src/domain/entities/movie/movie.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
} from 'typeorm';
import { ProducerEntity } from '../producer/producer.typeorm.entity';
import { StudioEntity } from '../studio/studio.typeorm.entity';

@Entity('movies')
@Index('idx_movies_title', ['year', 'title'])
@Index('idx_movies_winner', ['winner'])
export class MovieEntity extends Movie {
  @PrimaryColumn()
  declare id: string;

  @Column()
  declare year: number;

  @Column()
  declare title: string;

  @Column({ default: false })
  declare winner: boolean;

  @ManyToMany(() => ProducerEntity, (producer) => producer.movies)
  @JoinTable({
    name: 'producers_movies',
    joinColumn: { name: 'movieId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'producerId', referencedColumnName: 'id' },
  })
  producers_relation: ProducerEntity[];

  @ManyToMany(() => StudioEntity, (studio) => studio.movies)
  @JoinTable({
    name: 'studios_movies',
    joinColumn: { name: 'movieId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'studioId', referencedColumnName: 'id' },
  })
  studios_relation: StudioEntity[];
}
