import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import { join } from 'path';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';

const csvPath = join(__dirname, '../data/movielist.csv');
const originalCsvBackup = join(__dirname, '../data/movielist_backup.csv');

function runCsvLoaderTest(loader: string) {
  describe(`ProducersController (e2e) - CSV Loader: ${loader}`, () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
      // 🔹 Backup do CSV original, se existir
      if (fs.existsSync(csvPath)) {
        fs.renameSync(csvPath, originalCsvBackup);
      }

      // 🔹 Criar um novo CSV de teste
      const testCsvContent = `year;title;studios;producers;winner
2000;Movie A;Studio X;Producer X and Producer A;yes
2005;Movie B;Studio X;Producer X, Producer A and Producer B;yes
2010;Movie C;Studio Y;Producer Y, Producer A and Producer C;yes
2015;Movie D;Studio Z;Producer Z;yes
2020;Movie E;Studio X;Producer X and Producer A;yes`;

      fs.writeFileSync(csvPath, testCsvContent);

      process.env.CSV_LOADER = loader;

      console.log(
        `🔹 [${loader}] Usando loader: ${loader} iniciando aplicação`,
      );

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

      // 🔹 Restaurar CSV original
      if (fs.existsSync(originalCsvBackup)) {
        fs.renameSync(originalCsvBackup, csvPath);
      } else {
        fs.unlinkSync(csvPath);
      }
    }, 20000);

    it('Deve processar corretamente o CSV e retornar os intervalos corretos', async () => {
      const response = await request(app.getHttpServer())
        .get('/producers/awards/intervals')
        .expect(200);

      console.log(`🔹 [${loader}] Resposta da API:`, response.body);

      expect(response.body).toEqual({
        min: [
          {
            producer: 'Producer X',
            interval: 5,
            previousWin: 2000,
            followingWin: 2005,
          },
          {
            producer: 'Producer A',
            interval: 5,
            previousWin: 2000,
            followingWin: 2005,
          },
          {
            producer: 'Producer A',
            interval: 5,
            previousWin: 2005,
            followingWin: 2010,
          },
        ],
        max: [
          {
            producer: 'Producer X',
            interval: 15,
            previousWin: 2005,
            followingWin: 2020,
          },
        ],
      });
    });
  });
}

// 🔹 Executa os testes para cada loader
['fastcsv', 'worker'].forEach(runCsvLoaderTest);
