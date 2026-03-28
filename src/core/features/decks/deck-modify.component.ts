import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DeckService } from '../../services/deck.service';
import { CollectionService } from '../../services/collection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionItemModel } from '../../models/collection.model';
import { CreateDeckRequest } from '../../models/created-deck-request.model';
import { UserModelService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from "../../shared/components/loader/loader.component";

@Component({
    selector: 'app-deck-modify',
    standalone: true,
    imports: [CommonModule, FormsModule, LoaderComponent],
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

    userId!: string;
    deckId!: number;

    deckName: string = '';
    deckCards: { card: CollectionItemModel, quantity: number }[] = [];

    allCards: CollectionItemModel[] = [];
    loading: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private deckService: DeckService,
        private collectionService: CollectionService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.userId = this.route.snapshot.paramMap.get('userId')!;
        this.deckId = Number(this.route.snapshot.paramMap.get('deckId'));

        this.loadDeck();
    }

    loadDeck(): void {
        this.loading = true;

        this.deckService.getDeckDetail(this.userId, this.deckId).subscribe({
            next: (deck) => {

                this.deckName = deck.name;

                this.deckCards = (deck.cards || []).map((c: any) => ({
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

                this.loadCollection();

                this.loading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    loadCollection(): void {
        this.collectionService.getMyCollection(this.userId).subscribe({
            next: (cards) => {
                this.allCards = cards;
                this.cdr.detectChanges(); // 🔥 IMPORTANT
            },
            error: (err) => console.error(err)
        });
    }

    addCardToDeck(card: CollectionItemModel): void {
        const existing = this.deckCards.find(c => c.card.cardId === card.cardId);

        if (existing) {
            if (existing.quantity < card.quantity) {
                existing.quantity++;
            } else {
                alert('Limite atteinte pour cette carte');
            }
        } else {
            this.deckCards.push({ card, quantity: 1 });
        }
    }

    removeCard(cardId: number): void {
        this.deckCards = this.deckCards.filter(c => c.card.cardId !== cardId);
    }

    increase(cardId: number): void {
        const deckCard = this.deckCards.find(c => c.card.cardId === cardId);
        const collectionCard = this.allCards.find(c => c.cardId === cardId);

        if (deckCard && collectionCard && deckCard.quantity < collectionCard.quantity) {
            deckCard.quantity++;
        }
    }

    decrease(cardId: number): void {
        const deckCard = this.deckCards.find(c => c.card.cardId === cardId);

        if (deckCard) {
            deckCard.quantity--;

            if (deckCard.quantity <= 0) {
                this.removeCard(cardId);
            }
        }
    }

    isMaxReached(card: CollectionItemModel): boolean {
        const deckCard = this.deckCards.find(c => c.card.cardId === card.cardId);
        return deckCard ? deckCard.quantity >= card.quantity : false;
    }

    saveDeck(): void {
        const payload: CreateDeckRequest = {
            name: this.deckName,
            cards: this.deckCards.map(c => ({
                id: c.card.cardId,
                quantity: c.quantity
            }))
        };

        this.deckService.update(this.userId, this.deckId, payload).subscribe({
            next: () => {
                alert('Deck sauvegardé !');
                this.router.navigate(['/decks']);
            },
            error: err => console.error(err)
        });
    }

    cancel(): void {
        this.router.navigate(['/decks']);
    }
}