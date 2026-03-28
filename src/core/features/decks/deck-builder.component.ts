import { Component, OnInit } from '@angular/core';
import { DeckService } from '../../services/deck.service';
import { CollectionService } from '../../services/collection.service';
import { DeckModel } from '../../models/deck.model';
import { CollectionItemModel } from '../../models/collection.model';
import { CreateDeckRequest } from '../../models/created-deck-request.model';
import { UserModelService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-deck-builder',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './deck-builder.component.html',
    styles: [`ul.list-group li {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

ul.list-group li button {
  margin-left: 10px;
}

h4 {
  margin-bottom: 15px;
}

.mt-3 {
  margin-top: 20px !important;
}`]
})
export class DeckBuilderComponent implements OnInit {

    allCards: CollectionItemModel[] = [];
    filteredCards: CollectionItemModel[] = [];

    deckName: string = '';
    deckCards: { card: CollectionItemModel, quantity: number }[] = [];

    userId: string = '';

    selectedTypes: string[] = [];
    availableTypes: string[] = [];

    constructor(
        private collectionService: CollectionService,
        private userService: UserModelService,
        private deckService: DeckService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe(user => {
            if (user) {
                this.userId = user.sub;
                this.loadCollection();
            }
        });
    }

    loadCollection(): void {
        this.collectionService.getMyCollection(this.userId).subscribe(cards => {
            this.allCards = cards;

            const types = new Set(cards.map(c => c.type));
            this.availableTypes = Array.from(types);

            // IMPORTANT → affichage initial
            this.filterCards();
        });
    }

    toggleType(type: string): void {
        if (this.selectedTypes.includes(type)) {
            this.selectedTypes = this.selectedTypes.filter(t => t !== type);
        } else {
            if (this.selectedTypes.length >= 2) {
                alert("Vous ne pouvez choisir que 2 types maximum");
                return;
            }
            this.selectedTypes.push(type);
        }

        this.filterCards();
    }

    filterCards(): void {
        if (this.selectedTypes.length === 0) {
            this.filteredCards = [];
            return;
        }

        this.filteredCards = this.allCards.filter(card =>
            this.selectedTypes.includes(card.type)
        );
    }

    addCardToDeck(card: CollectionItemModel): void {
        if (this.selectedTypes.length === 0) {
            alert("Choisissez au moins un type.");
            return;
        }

        const existing = this.deckCards.find(c => c.card.cardId === card.cardId);

        if (existing) {
            existing.quantity++;
        } else {
            this.deckCards.push({ card, quantity: 1 });
        }
    }

    // ✅ supprimer UNE seule carte
    removeOneCardFromDeck(cardId: number): void {
        const index = this.deckCards.findIndex(c => c.card.cardId === cardId);

        if (index !== -1) {
            if (this.deckCards[index].quantity > 1) {
                this.deckCards[index].quantity--;
            } else {
                this.deckCards.splice(index, 1);
            }
        }
    }

    // ❌ supprimer totalement
    removeCardFromDeck(cardId: number): void {
        this.deckCards = this.deckCards.filter(c => c.card.cardId !== cardId);
    }

    saveDeck(): void {
        const payload: CreateDeckRequest & { userId: string } = {
            name: this.deckName,
            cards: this.deckCards.map(c => ({
                id: c.card.cardId,
                quantity: c.quantity
            })),
            userId: this.userId
        };

        this.deckService.create(payload).subscribe({
            next: () => {
                alert('Deck créé avec succès !');
                this.router.navigate(['/decks']);
            },
            error: err => console.error('Erreur création deck', err)
        });
    }

    cancel(): void {
        this.router.navigate(['/decks']);
    }
}