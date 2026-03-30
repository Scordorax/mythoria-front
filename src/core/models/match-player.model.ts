import { CardModel } from './card.model';

export interface MatchPlayer {
  username: string;
  lifePoints: number;
  energy: number;

  hand: CardModel[];
  activeCard: CardModel | null;

  deckCount: number;
  discard: CardModel[];
}