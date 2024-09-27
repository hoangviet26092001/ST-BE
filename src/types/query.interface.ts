export interface ICrudOption {
  where?: object;
  take?: number;
  skip?: number;
  select?: object;
  include?: { [key: string]: any };
  orderBy?: object;
  distinct?: string[];

  [key: string]: any;
}
