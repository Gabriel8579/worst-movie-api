import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieModule } from './application/services/movie/movie.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './infrastructure/config/configuration';
import { ProducersController } from './infrastructure/controllers/producers.controller';
import { ProducerModule } from './application/services/producer/producer.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: ':memory:',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env'],
    }),
    CacheModule.register(),
    MovieModule,
    ProducerModule,
  ],
  controllers: [ProducersController],
})
export class AppModule {}
