import { Module } from '@nestjs/common';
import { GetProducerAwardsUseCase } from 'src/application/use-cases/producers/get-producer-awards.use-case';
import { GetProducerAwards } from 'src/domain/ports/producers/get-producer-awards.interface';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: GetProducerAwards,
      useClass: GetProducerAwardsUseCase,
    },
  ],
  exports: [GetProducerAwards],
})
export class ProducerModule {}
