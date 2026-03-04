import { CardModel } from './card.model';

export interface BoosterModel {
  id: number;
  name: string;
  price?: number;
  cards?: CardModel[];
}