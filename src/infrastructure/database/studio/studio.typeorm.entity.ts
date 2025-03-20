import { Studio } from 'src/domain/entities/studio/studio.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MovieEntity } from '../movie/movie.typeorm.entity';

@Entity('studios')
export class StudioEntity extends Studio {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column()
  declare name: string;

  @ManyToMany(() => MovieEntity, (movie) => movie.studios_relation)
  movies: MovieEntity[];
}
