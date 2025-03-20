import { ThreadWorker } from 'poolifier';
import { Movie } from 'src/domain/entities/movie/movie.entity';
import { splitNames } from 'src/utils/splitName';

export default new ThreadWorker(parseMovieCsvWorker);

function parseMovieCsvWorker(batch: string[]): Partial<Movie>[] {
  if (!batch.length) return [];

  const header = batch
    .shift()
    ?.split(';')
    .map((col) => col.trim().toLowerCase());

  if (!header) {
    throw new Error('CSV mal formatado: Cabeçalho ausente');
  }

  return batch.map((line) => {
    const values = line.split(';');

    const movieData: Record<string, string> = {};
    header.forEach((col, index) => {
      movieData[col] = values[index]?.trim() || '';
    });

    return {
      year: parseInt(movieData['year'], 10),
      title: movieData['title'],
      studios: splitNames(movieData['studios']),
      producers: splitNames(movieData['producers']),
      winner: movieData['winner'].toLowerCase() === 'yes',
    };
  });
}
