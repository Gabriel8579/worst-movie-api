import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { join } from 'path';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';

function runCsvLoaderTest(loader: string) {
  describe(`ProducersController (e2e) - CSV Loader: ${loader}`, () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
      process.env.CSV_LOADER = loader;

      console.log(`[${loader}] Usando loader: ${loader} iniciando aplicação`);

      jest.resetModules();

      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();

      dataSource = app.get(DataSource);
      if (!dataSource.isInitialized) {
        await dataSource.initialize();
      }
    });

    afterAll(async () => {
      await app.close();
    });

    it('Deve processar corretamente o CSV e retornar os intervalos corretos', async () => {
      const response = await request(app.getHttpServer())
        .get('/producers/awards/intervals')
        .expect(200);

      console.log(`[${loader}] Resposta da API:`, response.body);

      expect(response.body).toEqual({
        min: [
          {
            producer: 'Joel Silver',
            interval: 1,
            previousWin: 1990,
            followingWin: 1991,
          },
        ],
        max: [
          {
            producer: 'Matthew Vaughn',
            interval: 13,
            previousWin: 2002,
            followingWin: 2015,
          },
        ],
      });
    });
  });
}

['fastcsv', 'worker'].forEach(runCsvLoaderTest);
