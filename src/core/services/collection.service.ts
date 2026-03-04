import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environnement/environnement';
import { CollectionItemModel } from '../models/collection.model';


@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  private readonly baseUrl = `${environment.apiUrl}/collections`;

  constructor(private http: HttpClient) {}

  getMyCollection(): Observable<CollectionItemModel[]> {
    return this.http.get<CollectionItemModel[]>(this.baseUrl);
  }

}