import { Inject, Injectable } from '@nestjs/common';
import { MovieRepository } from 'src/domain/ports/movie/movie.repository';
import { GetProducerAwards } from 'src/domain/ports/producers/get-producer-awards.interface';
import { MOVIE_REPOSITORY } from '../../../domain/ports/movie/movie.repository';
import {
  ProducerAwardInterval,
  ProducerAwards,
} from 'src/domain/ports/producers/producers.types';

@Injectable()
export class GetProducerAwardsUseCase extends GetProducerAwards {
  constructor(
    @Inject(MOVIE_REPOSITORY) private readonly movieRepository: MovieRepository,
  ) {
    super();
  }

  async execute(): Promise<ProducerAwards> {
    const producerWins =
      await this.movieRepository.getWinningMoviesByProducer();

    const awardIntervals: ProducerAwardInterval[] = [];

    for (const [producer, wins] of Object.entries(producerWins)) {
      for (let i = 1; i < wins.length; i++) {
        const previousWin = wins[i - 1];
        const followingWin = wins[i];
        const interval = followingWin - previousWin;

        awardIntervals.push({
          producer,
          interval,
          previousWin,
          followingWin,
        });
      }
    }

    // Ordena os intervalos
    awardIntervals.sort((a, b) => a.interval - b.interval);

    const minValue = awardIntervals[0]?.interval ?? 0;
    const maxValue = awardIntervals[awardIntervals.length - 1]?.interval ?? 0;

    // Filtra os intervalos únicos
    const minIntervals = Array.from(
      new Map(
        awardIntervals
          .filter((item) => item.interval === minValue)
          .map((item) => [
            `${item.producer}-${item.previousWin}-${item.followingWin}`,
            item,
          ]),
      ).values(),
    );

    const maxIntervals = Array.from(
      new Map(
        awardIntervals
          .filter((item) => item.interval === maxValue)
          .map((item) => [
            `${item.producer}-${item.previousWin}-${item.followingWin}`,
            item,
          ]),
      ).values(),
    );

    return {
      min: minIntervals,
      max: maxIntervals,
    };
  }
}
