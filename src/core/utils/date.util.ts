// core/utils/date.util.ts

export class DateUtil {

  /**
   * Retourne le timestamp actuel en secondes
   */
  static nowInSeconds(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Vérifie si une date (timestamp en secondes) est expirée
   */
  static isExpired(expiration: number): boolean {
    return expiration < this.nowInSeconds();
  }

  /**
   * Convertit timestamp (secondes) en Date JS
   */
  static fromTimestamp(timestamp: number): Date {
    return new Date(timestamp * 1000);
  }

  /**
   * Formate une date en string lisible
   * Format par défaut : dd/MM/yyyy HH:mm
   */
  static format(date: Date | number, locale: string = 'fr-FR'): string {
    const d = typeof date === 'number'
      ? this.fromTimestamp(date)
      : date;

    return d.toLocaleString(locale);
  }

  /**
   * Retourne le temps restant avant expiration (en secondes)
   */
  static remainingTime(expiration: number): number {
    return expiration - this.nowInSeconds();
  }

  /**
   * Vérifie si deux dates sont le même jour
   */
  static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}