import { Match } from "../models/match.model";
import { MatchPlayer } from "../models/match-player.model";
import { CardModel } from "../models/card.model";

export class MatchFactory {

  static createMatch(data: any): Match {
    return {
      matchId: data.matchId,
      playerId:data.playerId,
      status: data.status,
      turn: data.turn,
      players: data.players.map((p: any) =>
        this.createPlayer(p)
      )
    };
  }

  static createPlayer(data: any): MatchPlayer {
    return {
      userId:data.userId,
      username: data.username,
      lifePoints: data.lifePoints,
      energy: data.energy,
      deadCards:data.deadCards,

      hand: data.hand ? data.hand.map((c: any) => this.createCard(c)) : [],

      activeCard: data.activeCards
        ? data.activeCards.map((c: any) => this.createCard(c))
        : [],

      deckCount: data.deckCount ?? 0,
      discard: data.discard ? data.discard.map((c: any) => this.createCard(c)) : []
    };
  }

  static createCard(data: any): CardModel {
    return {
      id: data.id,
      name: data.name,
      description: data.description ?? '',
      type: data.type ?? 'normal',
      rarity: data.rarity ?? 'common',
      attack: data.attack,
      defense: data.defense,
      hp: data.hp,
      energyCost: data.energyCost
    };
  }
}