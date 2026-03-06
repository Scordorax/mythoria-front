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

  constructor(private http: HttpClient) { }

  // Récupérer tous les decks de l'utilisateur connecté
  getByUser(userId: string): Observable<DeckModel[]> {
    return this.http.get<DeckModel[]>(`${this.baseUrl}/user/${userId}`);
  }

  // Créer un deck
  create(data: any): Observable<{ message: string; deckId: number }> {
    return this.http.post<{ message: string; deckId: number }>(
      `${this.baseUrl}/create`,
      data
    );
  }

  // Supprimer un deck
  delete(userId: string, id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${userId}/${id}`);
  }

  // Modifier un deck existant
  update(id: number, data: CreateDeckRequest): Observable<{ message: string; deckId: number }> {
    return this.http.put<{ message: string; deckId: number }>(`${this.baseUrl}/${id}`, data);
  }

  // Récupérer un deck par son ID
  getById(id: number): Observable<DeckModel> {
    return this.http.get<DeckModel>(`${this.baseUrl}/${id}`);
  }

  getDeckDetail(userId: string, deckId: number) {
    return this.http.get<any>(`${this.baseUrl}/${userId}/${deckId}`);
  }

}