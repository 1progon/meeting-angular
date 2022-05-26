export interface ICache<T = any> {
  [key: string]: {
    expires: number;
    data: T;
  }

}
