import { Producer } from 'src/domain/entities/producer/producer.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MovieEntity } from '../movie/movie.typeorm.entity';

@Entity('producers')
export class ProducerEntity extends Producer {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column()
  declare name: string;

  @ManyToMany(() => MovieEntity, (movie) => movie.producers_relation)
  movies: MovieEntity[];
}
