import { MatchPlayer } from "./match-player.model";

export interface Match {
  matchId: any;
  playerId:any;
  status: string;
  turn: any;
  players: MatchPlayer[];
}