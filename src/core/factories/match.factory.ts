import { CardModel } from "../models/card.model";
import { MatchAction } from "../models/match-action.model";
import { MatchPlayer } from "../models/match-player.model";
import { Match } from "../models/match.model";


export class MatchFactory {

  static createMatch(data: any): Match {
    return {
      matchId: data.matchId,
      status: data.status,
      turn: data.turn,
      players: data.players.map((p: any) =>
        this.createPlayer(p)
      )
    };
  }

  static createPlayer(data: any): MatchPlayer {
    return {
      username: data.username,
      lifePoints: data.lifePoints,
      energy: data.energy,

      hand: data.hand ? data.hand.map((c: any) => this.createCard(c)) : [],
      activeCard: data.activeCard ? this.createCard(data.activeCard) : null,

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
   /**
   * 🤖 IA : choix de carte
   */
  static aiChooseCard(player: MatchPlayer): CardModel | null {
    if (!player.hand || player.hand.length === 0) return null;

    // Carte avec le plus d'attaque
    return player.hand.reduce((best, card) =>
      card.attack > best.attack ? card : best
    );
  }

  /**
   * 🤖 IA : décision d'action
   */
  static aiPlayTurn(player: MatchPlayer): MatchAction {
    const card = this.aiChooseCard(player);

    if (card) {
      return {
        type: 'PLAY_CARD',
        player: player.username,
        payload: {
          card: card.name,
          damage: card.attack
        },
        date: new Date().toISOString()
      };
    }

    return {
      type: 'SKIP',
      player: player.username,
      payload: {
        skip: true
      },
      date: new Date().toISOString()
    };
  }

}