export type ProducerAwardInterval = {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
};

export type ProducerAwards = {
  min: ProducerAwardInterval[];
  max: ProducerAwardInterval[];
};
