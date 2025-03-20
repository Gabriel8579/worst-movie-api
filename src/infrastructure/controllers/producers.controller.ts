import { CacheInterceptor } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetProducerAwardsResponseDto } from 'src/application/dtos/get-producer-awards.response.dto';
import { GetProducerAwards } from 'src/domain/ports/producers/get-producer-awards.interface';

@Controller('producers')
@ApiTags('Producers')
export class ProducersController {
  constructor(private readonly getProducerAwardsUseCase: GetProducerAwards) {}

  @Get('awards/intervals')
  @UseInterceptors(CacheInterceptor)
  @ApiOperation({
    summary: 'Get producers with the longest and shortest award intervals',
    description:
      'Retrieves the producer with the longest interval between two consecutive awards, ' +
      'and the producer with the shortest interval between two consecutive awards, ' +
      'following the specified response format.',
  })
  @ApiOkResponse({
    description:
      'Returns the producers who have the longest and shortest intervals between two consecutive awards.',
    type: GetProducerAwardsResponseDto,
  })
  async getProducerAwards(): Promise<GetProducerAwardsResponseDto> {
    return this.getProducerAwardsUseCase.execute();
  }
}
