import { Component, OnInit } from '@angular/core';
import { DeckService } from '../../services/deck.service';
import { CollectionService } from '../../services/collection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionItemModel } from '../../models/collection.model';
import { CreateDeckRequest } from '../../models/created-deck-request.model';
import { UserModelService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-deck-modify',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './deck-modify.component.html',
    styles: [`
        ul.list-group li {
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
    `]
})
export class DeckModifyComponent implements OnInit {

    userId: string = '';
    deckId!: number;
    deckName: string = '';
    deckCards: { card: CollectionItemModel, quantity: number }[] = [];

    allCards: CollectionItemModel[] = [];
    filteredCards: CollectionItemModel[] = [];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private deckService: DeckService,
        private collectionService: CollectionService,
        private userService: UserModelService
    ) { }

    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe(user => {
            if (user) {
                this.userId = user.sub;
                this.loadCollection();

                this.route.params.subscribe(params => {
                    if (params['id']) {
                        this.deckId = +params['id'];
                        this.loadDeck(this.deckId);
                    }
                });
            }
        });
    }

    loadCollection(): void {
        this.collectionService.getMyCollection(this.userId).subscribe(cards => {
            this.allCards = cards;
            this.updateFilteredCards();
        });
    }

    loadDeck(deckId: number): void {
        this.deckService.getById(deckId).subscribe({
            next: deck => {
                this.deckName = deck.name;
                this.deckCards = deck.cards.map(c => ({
                    card: {
                        collectionId: 0,
                        cardId: c.cardId,
                        cardName: c.name,
                        quantity: c.quantity,
                        description: '',
                        type: c.type,
                        rarity: c.rarity,
                        attack: c.attack,
                        defense: c.defense,
                        hp: c.hp,
                        energyCost: c.energyCost
                    },
                    quantity: c.quantity
                }));
                this.updateFilteredCards();
            },
            error: err => console.error('Erreur chargement deck', err)
        });
    }

    updateFilteredCards(): void {
        // Retirer les cartes déjà dans le deck pour éviter doublons
        const deckIds = this.deckCards.map(c => c.card.cardId);
        this.filteredCards = this.allCards.filter(c => !deckIds.includes(c.cardId));
    }

    addCardToDeck(card: CollectionItemModel): void {
        const existing = this.deckCards.find(c => c.card.cardId === card.cardId);
        if (existing) {
            existing.quantity++;
        } else {
            this.deckCards.push({ card, quantity: 1 });
        }
        this.updateFilteredCards();
    }

    removeCardFromDeck(cardId: number): void {
        this.deckCards = this.deckCards.filter(c => c.card.cardId !== cardId);
        this.updateFilteredCards();
    }

    saveDeck(): void {
        const payload: CreateDeckRequest & { userId: string } = {
            name: this.deckName,
            cards: this.deckCards.map(c => ({ id: c.card.cardId, quantity: c.quantity })),
            userId: this.userId
        };

        this.deckService.update(this.deckId, payload).subscribe({
            next: () => {
                alert('Deck modifié avec succès !');
                this.router.navigate(['/decks']);
            },
            error: err => console.error('Erreur modification deck', err)
        });
    }

    cancel(): void {
        this.router.navigate(['/decks']);
    }
}