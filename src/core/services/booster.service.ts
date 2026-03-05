import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environnement/environnement';
import { BoosterModel } from '../models/booster.model';


@Injectable({
  providedIn: 'root'
})
export class BoosterService {

  private readonly baseUrl = `${environment.apiUrl}/boosters`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<BoosterModel[]> {
    return this.http.get<BoosterModel[]>(this.baseUrl);
  }

  openBooster(userId: string, boosterId: number) {
    return this.http.post<{ message: string; userId: number; boosterId: number; cardsReceived: number }>(
      `${this.baseUrl}/open/${userId}/${boosterId}`,
      {}
    );
  }

}