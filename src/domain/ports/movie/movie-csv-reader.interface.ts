export abstract class MovieCsvReader {
  abstract read(filePath: string): Promise<void>;
}
