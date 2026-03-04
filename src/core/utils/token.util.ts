// core/utils/token.util.ts

import { UserModel } from '../models/user.model';
import { DateUtil } from './date.util';

export class TokenUtil {

  /**
   * Décodage sécurisé du JWT en récupérant le payload
   * @param token JWT
   * @returns payload décodé ou null
   */
  static decode(token: string): UserModel | null {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedJson = atob(payloadBase64);
      return JSON.parse(decodedJson);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  /**
   * Vérifie si le token est expiré
   * @param token JWT
   * @returns true si expiré
   */
  static isExpired(token: string): boolean {
    const payload = this.decode(token);
    if (!payload?.exp) return true;
    return DateUtil.isExpired(payload.exp);
  }

  /**
   * Vérifie si le token est valide
   * @param token JWT
   */
  static isValid(token: string | null): boolean {
    if (!token) return false;
    return !this.isExpired(token);
  }

  /**
   * Récupère l'ID utilisateur
   * @param token JWT
   */
  static getUserId(token: string): string | null {
    const payload = this.decode(token);
    return payload?.sub ?? null;
  }

  /**
   * Récupère l'email de l'utilisateur
   * @param token JWT
   */
  static getEmail(token: string): string | null {
    const payload = this.decode(token);
    return payload?.email ?? null;
  }

  /**
   * Récupère les rôles de l'utilisateur
   * @param token JWT
   */
  static getRoles(token: string): string[] {
    const payload = this.decode(token);
    return payload?.roles ?? [];
  }

  /**
   * Vérifie si un rôle spécifique est présent
   * @param token JWT
   * @param role rôle à vérifier
   */
  static hasRole(token: string, role: string): boolean {
    return this.getRoles(token).includes(role);
  }

  /**
   * Retourne la date d'expiration du token
   * @param token JWT
   */
  static getExpirationDate(token: string): Date | null {
    const payload = this.decode(token);
    if (!payload?.exp) return null;
    return DateUtil.fromTimestamp(payload.exp);
  }

  /**
   * Temps restant avant expiration en secondes
   * @param token JWT
   */
  static getRemainingTime(token: string): number {
    const payload = this.decode(token);
    if (!payload?.exp) return 0;
    return DateUtil.remainingTime(payload.exp);
  }

}