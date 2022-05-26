export interface IPersonRate {
  id: number,
  name: string,
  slug: string,
  price_in: number;
  price_out: number;
  currency_id: number;
  currency_name: string;
  currency_long_name: string;

}

export const ratesMap: { [id: number]: { id: number, name: string } } = {
  0: {id: 0, name: "Unknown"},
  1: {id: 1, name: "1 Hour"},
  2: {id: 2, name: "2 Hours"},
  3: {id: 3, name: "3 Hours"},
  4: {id: 4, name: "6 Hours"},
  5: {id: 5, name: "12 Hours"},
  6: {id: 6, name: "24 Hours"},
  7: {id: 7, name: "48 Hours"},
  8: {id: 8, name: "Another 24h"},

}








