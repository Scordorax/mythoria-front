import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environnement/environnement';
import { BoosterModel } from '../models/booster.model';
import { BoosterFactory } from '../factories/booster.factory';

@Injectable({
  providedIn: 'root'
})
export class BoosterService {

  private readonly baseUrl = `${environment.apiUrl}/boosters`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<BoosterModel[]> {
    return this.http.get<any[]>(this.baseUrl).pipe(
      map(data => BoosterFactory.fromApiList(data))
    );
  }

  openBooster(userId: string, boosterId: number) {
    return this.http.post<any>(
      `${this.baseUrl}/open/${userId}/${boosterId}`,
      {}
    );
  }
}