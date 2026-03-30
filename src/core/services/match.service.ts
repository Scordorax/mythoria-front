import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../environnement/environnement';
import { Match } from '../models/match.model';
import { MatchAction } from '../models/match-action.model';
import { MatchFactory } from '../factories/match.factory';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  private apiUrl = `${environment.apiUrl}/match`;

  constructor(private http: HttpClient) { }

  // =========================
  // 📊 GET MATCH
  // =========================
  getMatch(matchId: number): Observable<Match> {
    return this.http.get<any>(`${this.apiUrl}/${matchId}`)
      .pipe(
        map(data => MatchFactory.createMatch(data))
      );
  }

  // =========================
  // 🎮 CREATE MATCH
  // =========================
  createMatch(userId: number, deckId: number): Observable<number> {
    return this.http.post<any>(`${this.apiUrl}/create/${userId}/${deckId}`, {})
      .pipe(
        map(res => res.matchId)
      );
  }

  // =========================
  // 🃏 DRAW CARD
  // =========================
  drawCard(matchId: number,userId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${matchId}/draw-card`, {
      userId: userId,
    });
  }

  // =========================
  // 🃏 PLAY CARD
  // =========================
  playCard(matchId: number, userId: number, cardId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${matchId}/play-card`, {
      userId: userId, 
      cardId: cardId
    });
  }

  // =========================
  // 📜 GET ACTIONS (si backend OK)
  // =========================
  getActions(matchId: number): Observable<MatchAction[]> {
    return this.http.get<MatchAction[]>(`${this.apiUrl}/${matchId}/actions`);
  }

  // =========================
  // 🏁 END MATCH (optionnel)
  // =========================
  endMatch(matchId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${matchId}/end`, {});
  }
}