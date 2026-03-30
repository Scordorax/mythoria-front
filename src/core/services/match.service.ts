import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Match } from '../models/match.model';
import { MatchAction } from '../models/match-action.model';
import { environment } from '../../environnement/environnement';
import { MatchFactory } from '../factories/match.factory';

@Injectable({
    providedIn: 'root'
})
export class MatchService {

    private apiUrl = `${environment.apiUrl}/match`;

    constructor(private http: HttpClient) { }

    getMatches(userId: number): Observable<Match[]> {
        return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`).pipe(
            map(data => data.map(m => MatchFactory.createMatch(m)))
        );
    }

    createMatch(userId: string, deckId: number): Observable<number> {
        return this.http.post<any>(`${this.apiUrl}/create/${userId}/${deckId}`, {})
            .pipe(map(res => res.matchId));
    }

    getMatch(matchId: number): Observable<Match> {
        return this.http.get<any>(`${this.apiUrl}/${matchId}`).pipe(
            map(data => MatchFactory.createMatch(data))
        );
    }

    playCard(matchId: number, cardId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${matchId}/play-card`, {
            cardId: cardId
        });
    }

    getActions(matchId: number): Observable<MatchAction[]> {
        return this.http.get<MatchAction[]>(`${this.apiUrl}/${matchId}/actions`);
    }

    endMatch(matchId: number): Observable<any> {
        return this.http.post(`${this.apiUrl}/${matchId}/end`, {});
    }
}