import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environnement/environnement';
import { CreateDeckRequest } from '../models/created-deck-request.model';
import { DeckModel } from '../models/deck.model';


@Injectable({
  providedIn: 'root'
})
export class DeckService {

  private readonly baseUrl = `${environment.apiUrl}/decks`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<DeckModel[]> {
    return this.http.get<DeckModel[]>(this.baseUrl);
  }

  create(data: CreateDeckRequest): Observable<{ message: string; deckId: number }> {
    return this.http.post<{ message: string; deckId: number }>(
      `${this.baseUrl}/create`,
      data
    );
  }

  delete(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.baseUrl}/${id}`
    );
  }

}