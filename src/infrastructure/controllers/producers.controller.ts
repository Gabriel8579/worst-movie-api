import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { GetProducerAwards } from 'src/domain/ports/producers/get-producer-awards.interface';

@Controller('producers')
export class ProducersController {
  constructor(private readonly getProducerAwardsUseCase: GetProducerAwards) {}

  @Get('awards/intervals')
  @UseInterceptors(CacheInterceptor)
  async getProducerAwards() {
    return this.getProducerAwardsUseCase.execute();
  }
}
