import { MatchPlayer } from "./match-player.model";

export interface Match {
  matchId: number;
  status: string;
  turn: number;
  players: MatchPlayer[];
}