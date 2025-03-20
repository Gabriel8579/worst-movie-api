export abstract class ProducerAwardInterval {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export abstract class ProducerAwards {
  min: ProducerAwardInterval[];
  max: ProducerAwardInterval[];
}
