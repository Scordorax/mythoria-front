export interface DeckCardModel {
  cardId: number;
  name: string;
  quantity: number;
  type: string;
  rarity: string;
  attack: number;
  defense: number;
  hp: number;
  energyCost: number;
}

export interface DeckModel {
  deckId: number;
  name: string;
  cards: DeckCardModel[];
}