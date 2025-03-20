import { ApiResponseProperty } from '@nestjs/swagger';
import {
  ProducerAwardInterval,
  ProducerAwards,
} from 'src/domain/ports/producers/producers.types';

abstract class ProducerAwardIntervalDTO implements ProducerAwardInterval {
  @ApiResponseProperty()
  producer: string;
  @ApiResponseProperty()
  interval: number;
  @ApiResponseProperty()
  previousWin: number;
  @ApiResponseProperty()
  followingWin: number;
}

export abstract class GetProducerAwardsResponseDto implements ProducerAwards {
  @ApiResponseProperty({ type: [ProducerAwardIntervalDTO] })
  min: ProducerAwardInterval[];

  @ApiResponseProperty({ type: [ProducerAwardIntervalDTO] })
  max: ProducerAwardInterval[];
}
