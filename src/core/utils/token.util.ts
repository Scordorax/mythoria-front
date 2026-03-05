// core/utils/token.util.ts
import { UserModel } from '../models/user.model';
import { DateUtil } from './date.util';

export class TokenUtil {

  private static base64UrlDecode(data: string): string {
    data = data.replace(/-/g, '+').replace(/_/g, '/');
    const pad = data.length % 4;
    if (pad) data += '='.repeat(4 - pad);
    return atob(data);
  }

  /**
   * Décodage du token maison
   */
  static decode(token: string): UserModel | null {
    try {
      const payloadBase64 = token.split('.')[0];
      const decodedJson = this.base64UrlDecode(payloadBase64);
      return JSON.parse(decodedJson);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  /**
   * Vérifie si le token est expiré
   */
  static isExpired(token: string): boolean {
    const payload = this.decode(token);
    if (!payload?.exp) return true;
    return DateUtil.isExpired(payload.exp);
  }

  /**
   * Vérifie si le token est valide
   */
  static isValid(token: string | null): boolean {
    if (!token) return false;
    return !this.isExpired(token);
  }

  static getUserId(token: string): string | null {
    const payload = this.decode(token);
    return payload?.sub ?? null;
  }

  static getEmail(token: string): string | null {
    const payload = this.decode(token);
    return payload?.email ?? null;
  }

  static getRoles(token: string): string[] {
    const payload = this.decode(token);
    return payload?.roles ?? [];
  }

  static hasRole(token: string, role: string): boolean {
    return this.getRoles(token).includes(role);
  }

  static getExpirationDate(token: string): Date | null {
    const payload = this.decode(token);
    if (!payload?.exp) return null;
    return DateUtil.fromTimestamp(payload.exp);
  }

  static getRemainingTime(token: string): number {
    const payload = this.decode(token);
    if (!payload?.exp) return 0;
    return DateUtil.remainingTime(payload.exp);
  }
}