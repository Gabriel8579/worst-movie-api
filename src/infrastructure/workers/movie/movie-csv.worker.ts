import { randomUUID } from 'node:crypto';
import { ThreadWorker } from 'poolifier';
import { Movie } from 'src/domain/entities/movie/movie.entity';
import { splitNames } from 'src/utils/splitName';

export default new ThreadWorker(parseMovieCsvWorker);

function parseMovieCsvWorker(batch: string[]): Partial<Movie>[] {
  const id = randomUUID();
  console.log(`Worker ${id} started with ${batch.length} lines`);
  const parsed = batch.map((line) => {
    const [year, title, studios, producers, winner] = line.split(';');
    return {
      year: parseInt(year, 10),
      title,
      studios: splitNames(studios),
      producers: splitNames(producers),
      winner: winner.toLowerCase() === 'yes',
    };
  });
  console.log(`Worker ${id} finished processing`);
  return parsed;
}
