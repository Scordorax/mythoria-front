import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DeckService } from '../../services/deck.service';
import { DeckModel } from '../../models/deck.model';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BoosterService } from '../../services/booster.service';
import { CardService } from '../../services/card.service';
import { CollectionService } from '../../services/collection.service';
import { UserModelService } from '../../services/user.service';

@Component({
    selector: 'app-deck-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './deck-list.component.html',
    styles: [`
  .table img {
    border-radius: 8px;
    object-fit: cover;
  }

  .table td,
  .table th {
    vertical-align: middle;
    text-align: center; /* ⚡ centrer le contenu du tableau */
  }

  .card h6, .card p {
    text-align: center;
  }

  .text-end {
    margin-top: 20px;
  }

  /* Supprimer fond blanc général et centrer le container */
  .container {
    background: transparent !important;
  }
`]
})
export class DeckListComponent implements OnInit {

    decks: DeckModel[] = [];
    loading!: boolean;
    userId!: string;

    totalCards = 0;
    totalDecks = 0;
    totalBoosters = 0;
    totalCollectionCards = 0;

    constructor(
        private authService: AuthService,
        private cardService: CardService,
        private deckService: DeckService,
        private boosterService: BoosterService,
        private collectionService: CollectionService,
        private userService: UserModelService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loading = true; // ⚡ démarrer le chargement

        this.userService.getCurrentUser().subscribe(user => {
            this.userId = user.sub;

            this.loadDashboardStats();
            this.loadDecks();
        });
    }

    private loadDashboardStats(): void {
        this.cardService.getAll().subscribe(cards => {
            this.totalCards = cards.length;
            this.cdr.detectChanges();
        });

        this.boosterService.getAll().subscribe(boosters => {
            this.totalBoosters = boosters.length;
            this.cdr.detectChanges();
        });

        this.collectionService.getMyCollection(this.userId).subscribe(collection => {
            this.totalCollectionCards = collection.reduce((total, item) => total + item.quantity, 0);
            this.totalDecks = this.decks.length; // totalDecks calculé après loadDecks
            this.cdr.detectChanges();
        });
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }

    loadDecks(): void {
        this.deckService.getByUser(this.userId).subscribe({
            next: (data) => {
                this.decks = data;
                this.totalDecks = this.decks.length; // mettre à jour totalDecks
                this.loading = false; // ⚡ fin du chargement
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erreur récupération decks', err);
                this.loading = false; // ⚡ fin du chargement même en cas d'erreur
            }
        });
    }

    deleteDeck(deckId: number): void {
        if (confirm('Voulez-vous vraiment supprimer ce deck ?')) {
            this.deckService.delete(this.userId, deckId).subscribe({
                next: () => {

                    // recharger les decks
                    this.loadDecks();

                    // recharger les stats
                    this.loadDashboardStats();

                },
                error: err => console.error('Erreur suppression deck', err)
            });
        }
    }

    editDeck(deckId: number): void {
        this.router.navigate(['/decks/modify', this.userId, deckId]);
    }

    viewDeck(deckId: number): void {
        this.router.navigate(['/decks', this.userId, deckId]);
    }

    createNewDeck(): void {
        this.router.navigate(['/decks/builder']);
    }

}