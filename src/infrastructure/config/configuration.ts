export interface ConfigSchema {
  port: number;
  csvLoader: string;
  workers_pool_size: number;
  workers_batch_size: number;
  sql_batch_size: number;
}

const configuration = (): ConfigSchema => ({
  port: Number(process.env.PORT) || 3000,
  csvLoader: process.env.CSV_LOADER || 'worker',
  workers_pool_size: Number(process.env.WORKERS_POOL_SIZE) || 4,
  workers_batch_size: Number(process.env.WORKERS_BATCH_SIZE) || 10,
  sql_batch_size: Number(process.env.SQL_BATCH_SIZE) || 1000,
});

export default configuration;
