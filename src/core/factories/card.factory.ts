import { CardModel } from '../models/card.model';

export class CardFactory {

  static create(data: any): CardModel {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      type: data.type,
      rarity: data.rarity,
      attack: Number(data.attack),
      defense: Number(data.defense),
      hp: Number(data.hp),
      energyCost: Number(data.energyCost)
    };
  }

  static createList(data: any[]): CardModel[] {
    return data.map(card => this.create(card));
  }
}