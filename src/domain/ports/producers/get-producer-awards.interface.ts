import { ProducerAwards } from './producers.types';

export abstract class GetProducerAwards {
  abstract execute(): Promise<ProducerAwards>;
}
