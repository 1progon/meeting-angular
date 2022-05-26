export interface IResponse<T> {
  status: string;
  data: T;
  responseCode: number;
}
