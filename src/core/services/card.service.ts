import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environnement/environnement';
import { CardModel } from '../models/card.model';


@Injectable({
  providedIn: 'root'
})
export class CardService {

  private readonly baseUrl = `${environment.apiUrl}/cards`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<CardModel[]> {
    return this.http.get<CardModel[]>(this.baseUrl);
  }

  getById(id: number): Observable<CardModel> {
    return this.http.get<CardModel>(`${this.baseUrl}/${id}`);
  }

}