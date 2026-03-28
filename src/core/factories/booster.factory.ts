import { BoosterModel } from "../models/booster.model";

export class BoosterFactory {

  static fromApi(data: any): BoosterModel {
    return {
      id: data.id,
      name: data.name,
      price: data.price,
      cards: data.cards || []
    };
  }

  static fromApiList(data: any[]): BoosterModel[] {
    return data.map(b => this.fromApi(b));
  }

  static getBoosterColor(name: string): number {
    const colors: any = {
      "Booster Flamme": 0xff4500,
      "Booster Aqua": 0x1e90ff,
      "Booster Éclair": 0xffff00,
      "Booster Terre": 0x8b4513,
      "Booster Vent": 0xd3d3d3,
      "Booster Foudre": 0xffd700,
      "Booster Eau": 0x00bfff,
      "Booster Feu": 0xff0000,
      "Booster Plante": 0x32cd32,
      "Booster Roche": 0x696969
    };

    return colors[name] || 0xffffff;
  }

  static filterByType(boosters: BoosterModel[], type: string): BoosterModel[] {
    return boosters.filter(b => b.name === type);
  }
}