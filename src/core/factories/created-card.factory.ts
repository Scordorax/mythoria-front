import { CardModel } from "../models/card.model";

export class PokemonCardFactory {

  private types = ['Fire', 'Water', 'Grass', 'Electric', 'Psychic', 'Dark', 'Fairy'];
  private rarities = ['Common', 'Rare', 'Epic', 'Legendary'];

  public created(): CardModel {
    return {
      id: 0,
      name: this.generateName(),
      description: 'Generated Pokémon',
      type: this.random(this.types),
      rarity: this.random(this.rarities),
      attack: this.stat(),
      defense: this.stat(),
      hp: this.hp(),
      energyCost: this.energy()
    };
  }

  private generateName(): string {
    const syllables = ['ka','zu','ra','mi','to','ne','shi','lu','ta','vi','dra','po','xi','na','ki'];

    let name = '';
    const count = Math.floor(Math.random() * 2) + 2;

    for (let i = 0; i < count; i++) {
      name += syllables[Math.floor(Math.random() * syllables.length)];
    }

    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  private random<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private stat(): number {
    return Math.floor(Math.random() * 100) + 10;
  }

  private hp(): number {
    return Math.floor(Math.random() * 250) + 50;
  }

  private energy(): number {
    return Math.floor(Math.random() * 10) + 1;
  }
}