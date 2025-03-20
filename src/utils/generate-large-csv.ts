import * as fs from 'fs';
import * as path from 'path';

function getRandomYear(): number {
  return Math.floor(Math.random() * (2025 - 1980 + 1)) + 1980;
}

function generateRandomString(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

function generateUniqueTitles(count: number): string[] {
  return Array.from(
    { length: count },
    (_, i) => `Movie ${i + 1} ${generateRandomString()}`,
  );
}

function getRandomElements(array: string[], count: number): string {
  const selected = new Set<string>();
  while (selected.size < count) {
    selected.add(array[Math.floor(Math.random() * array.length)]);
  }
  return Array.from(selected)
    .join(', ')
    .replace(/, ([^,]*)$/, ' and $1');
}

function generateRandomList(size: number, prefix: string): string[] {
  return Array.from(
    { length: size },
    (_, i) => `${prefix} ${i + 1} ${generateRandomString()}`,
  );
}

function getRandomWinner(): string {
  return Math.random() > 0.5 ? 'yes' : '';
}

function generateCSV(rows: number = 10): void {
  const header = 'year;title;studios;producers;winner';
  const titles = generateUniqueTitles(rows);
  const studioCount = 30;
  const producerCount = 45;
  const studios = generateRandomList(studioCount, 'Studio');
  const producers = generateRandomList(producerCount, 'Producer');
  const filePath = path.join(__dirname, '../../data', 'movielist.csv');
  const stream = fs.createWriteStream(filePath, { encoding: 'utf8' });

  console.log('Iniciando geração do CSV...');
  console.log(`Total de registros: ${rows}`);
  console.log(`Total de estúdios: ${studioCount}`);
  console.log(`Total de produtores: ${producerCount}`);

  stream.write(header + '\n');
  for (let i = 0; i < rows; i++) {
    if (i % rows === 0) {
      console.log(
        `Progresso: ${((i / rows) * 100).toFixed(2)}% (${i} registros gerados)`,
      );
    }

    const row = [
      getRandomYear().toString(),
      titles[i],
      getRandomElements(studios, Math.floor(Math.random() * 3) + 1),
      getRandomElements(producers, Math.floor(Math.random() * 3) + 1),
      getRandomWinner(),
    ].join(';');
    stream.write(row + '\n');
  }

  stream.end(() => {
    console.log(`CSV gerado com sucesso: ${filePath}`);
  });
}

generateCSV(10000);
