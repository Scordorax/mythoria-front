import { Injectable } from '@angular/core';
import { TokenUtil } from '../utils/token.util';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environnement/environnement';

interface LoginResponse {
  token: string;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly TOKEN_KEY = 'token';
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // ==============================
  // 🔹 TOKEN MANAGEMENT
  // ==============================

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // ==============================
  // 🔹 AUTHENTICATION / ROLES
  // ==============================

  isAuthenticated(): boolean {
    const token = this.getToken();
    return TokenUtil.isValid(token);
  }

  hasRole(role: string): boolean {
    const token = this.getToken();
    if (!token) return false;
    return TokenUtil.hasRole(token, role);
  }

  getRoles(): string[] {
    const token = this.getToken();
    return token ? TokenUtil.getRoles(token) : [];
  }

  getUserId(): string | null {
    const token = this.getToken();
    return token ? TokenUtil.getUserId(token) : null;
  }

  getEmail(): string | null {
    const token = this.getToken();
    return token ? TokenUtil.getEmail(token) : null;
  }

  getExpirationDate(): Date | null {
    const token = this.getToken();
    return token ? TokenUtil.getExpirationDate(token) : null;
  }

  getRemainingTime(): number {
    const token = this.getToken();
    return token ? TokenUtil.getRemainingTime(token) : 0;
  }

  logout(): void {
    this.removeToken();
  }

  // ==============================
  // 🔹 ROUTES API (BDD)
  // ==============================

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { email, password });
  }

  register(data: RegisterData): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }
}