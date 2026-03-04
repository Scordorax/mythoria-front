import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-ui',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-ui.component.html',
})
export class CardUiComponent {
  @Input() name = '';
  @Input() type = '';
  @Input() rarity = '';
  @Input() image = '';
}