import { Component } from '@angular/core';
import { CardFactory } from '../../factories/card.factory';
import { CardModel } from '../../models/card.model';
import { CardService } from '../../services/card.service';
import { PokemonCardFactory } from '../../factories/created-card.factory';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoosterService } from '../../services/booster.service';
import { BoosterModel } from '../../models/booster.model';


@Component({
    standalone: true,
    imports: [CommonModule, FormsModule],
    selector: 'app-card-factory',
    templateUrl: './card-factory.component.html',
    styles: [`.container {
  text-align: center;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.card-preview {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  display: inline-block;
  text-align: left;
}`]
})
export class CardFactoryComponent {

    quantity: number = 1;
    createdCards: CardModel[] = [];
    boosters: BoosterModel[] = [];

    constructor(private cardService: CardService, private boosterService: BoosterService) { }


    ngOnInit(): void {
        this.boosterService.getAll().subscribe(boosters => {
            this.boosters = boosters;
           
        });
    }

    getRandomBooster(): BoosterModel {
        const index = Math.floor(Math.random() * this.boosters.length);
        return this.boosters[index];
    }

    createCards(): void {
        this.createdCards = [];

        const factory = new PokemonCardFactory();

        for (let i = 0; i < this.quantity; i++) {
            const card = factory.created();
            this.createdCards.push(card);

            // 🔥 récupérer un booster aléatoire
            const booster = this.getRandomBooster();

            this.cardService.createCard(card, booster.id).subscribe({
                next: (res) => {
                    
                },
                error: (err) => {
                    console.error(err);
                }
            });
        }
    }
}