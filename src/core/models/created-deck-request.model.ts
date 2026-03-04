export interface CreateDeckRequest {
  name: string;
  cards: {
    id: number;
    quantity: number;
  }[];
}