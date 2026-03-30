import { CardModel } from './card.model';

export interface MatchPlayer {
  userId: any;
  username: string;
  lifePoints: number;
  energy: number;

  hand: CardModel[];
  activeCard: CardModel | null;
  deadCards: CardModel[];

  deckCount: number;
  discard: CardModel[];
}