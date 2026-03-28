import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environnement/environnement';
import { CardModel } from '../models/card.model';
import { CardFactory } from '../factories/card.factory';

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private readonly baseUrl = `${environment.apiUrl}/cards`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<CardModel[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(data => CardFactory.createList(data))
    );
  }

  getById(id: number): Observable<CardModel> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(data => CardFactory.create(data))
    );
  }
}