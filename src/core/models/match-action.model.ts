export interface MatchAction {
  type: string;
  player: string;
  payload: {
    card?: string;
    damage?: number;
    ko?: boolean;
    skip?: boolean;
  };
  date: string;
}