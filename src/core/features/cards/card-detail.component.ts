import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CardService } from '../../services/card.service';
import { CardModel } from '../../models/card.model';
import * as THREE from 'three';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-card-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './card-detail.component.html',
    styles: [`
    .card-container {
      background-color: #000;
      color: #fff;
      padding: 1rem;
      border-radius: 10px;
    }

    .card-container h2 {
      text-align: center;
      margin-bottom: 1rem;
      color: #fff;
    }

    .three-container {
      width: 100%;
      height: 600px;
      border-radius: 10px;
      background-color: #000;
    }

    button {
      min-width: 120px;
      font-weight: bold;
    }
    .card-container {
  background-color: #000;
  color: #fff;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
}

.pokemon-wrapper {
  margin-top: 2rem;
}

.pokemon-large {
  width: 150px; /* ou la taille que tu veux */
  height: auto;
}
  `]
})
export class CardDetailComponent implements OnChanges {
    @Input() cardId!: number;
    selectedCard?: CardModel;
    showBigPokemon = false; // pour le bouton

    constructor(private cardService: CardService) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['cardId'] && this.cardId) {
            // Réinitialiser avant de charger
            this.selectedCard = undefined;
            this.showBigPokemon = false;

            // Charger la nouvelle carte ET n'ouvrir la modal que lorsque loaded
            this.loadCard(this.cardId);
        }
    }

    loadCard(id: number) {
        this.cardService.getById(id).subscribe({
            next: card => {
                this.selectedCard = card; // maintenant la carte est prête
            },
            error: err => console.error(err)
        });
    }
}