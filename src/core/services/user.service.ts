import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environnement/environnement';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserModelService {

  private apiUrl = `${environment.apiUrl}/api/users`; // URL REST alignée

  // State management utilisateur courant
  private currentUserSubject = new BehaviorSubject<UserModel | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  /* =========================
     Récupérer l'utilisateur courant
  ========================== */
  getCurrentUser(): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/me`).pipe(
      tap(user => this.currentUserSubject.next(user))
    );
  }

  /* =========================
     Récupérer un utilisateur par ID
  ========================== */
  getById(id: string): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/${id}`);
  }

  /* =========================
     Récupérer tous les utilisateurs (admin)
  ========================== */
  getAll(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.apiUrl);
  }

  /* =========================
     Mettre à jour un utilisateur
  ========================== */
  update(id: string, data: Partial<UserModel>): Observable<UserModel> {
    return this.http.put<UserModel>(`${this.apiUrl}/${id}`, data).pipe(
      tap(updatedUser => {
        const current = this.currentUserSubject.value;
        if (current && current.sub === id) {
          this.currentUserSubject.next(updatedUser);
        }
      })
    );
  }

  /* =========================
     Supprimer un utilisateur (admin)
  ========================== */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /* =========================
     Déconnexion / vider l'état
  ========================== */
  clearCurrentUser(): void {
    this.currentUserSubject.next(null);
  }
}