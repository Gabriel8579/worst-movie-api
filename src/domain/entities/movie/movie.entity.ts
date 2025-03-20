export class Movie {
  constructor(
    public id: string | undefined,
    public year: number,
    public title: string,
    public winner: boolean,
    public studios: string[] | undefined,
    public producers: string[] | undefined,
  ) {}
}
