import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rarity'
})
export class RarityPipe implements PipeTransform {
  transform(value: string): string {
    switch (value?.toLowerCase()) {
      case 'common': return 'gray';
      case 'rare': return 'blue';
      case 'epic': return 'purple';
      case 'legendary': return 'gold';
      default: return 'black';
    }
  }
}