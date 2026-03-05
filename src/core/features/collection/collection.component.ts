import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CollectionItemModel } from '../../models/collection.model';
import { CollectionService } from '../../services/collection.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BoosterService } from '../../services/booster.service';
import { CardService } from '../../services/card.service';
import { DeckService } from '../../services/deck.service';
import { UserModelService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'app-collection',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './collection.component.html',
    styles:
        [`
        .pokemon-card {
            background: linear-gradient(135deg, #1d68b3, #e9ecef); 
            border-radius: 15px;                                   
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);             
            overflow: hidden;
            transition: transform 0.3s;
            cursor: pointer;

            &:hover {
                transform: scale(1.05);                             
            }

            .card-header {
                background: rgba(255, 203, 5, 0.9);                 
                color: #2a75bb;                                      
                padding: 0.5rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-weight: bold;
            }

            .card-body {
                padding: 0.75rem;

                .stats {
                display: flex;
                justify-content: space-between;
                margin-top: 0.5rem;
                font-size: 0.85rem;
                font-weight: 600;
                }
            }

            .card-footer {
                background: #2a75bb;
                color: white;
                font-weight: bold;
                padding: 0.5rem;

                .quantity {
                font-size: 1rem;
                }
            }
            }
    
        `]
})
export class CollectionComponent implements OnInit {

    collection: CollectionItemModel[] = [];
    loading!: boolean
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



        this.userService.getCurrentUser().subscribe(user => {
            this.userId = user.sub;
            this.loadDashboardStats(this.userId);
            this.loadCollection(this.userId);
        });


    }

    private loadDashboardStats(userId: string): void {

        this.cardService.getAll().subscribe(cards => {
            this.totalCards = cards.length;
            this.cdr.detectChanges();
        });

        this.deckService.getAll().subscribe(decks => {
            this.totalDecks = decks.length;
            this.cdr.detectChanges();
        });

        this.boosterService.getAll().subscribe(boosters => {
            this.totalBoosters = boosters.length;
            this.cdr.detectChanges();
        });

        this.collectionService.getMyCollection(userId).subscribe(collection => {
            this.totalCollectionCards = collection.reduce(
                (total, item) => total + item.quantity,
                0
            );
            this.cdr.detectChanges();
        });
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/auth/login']);
    }


    loadCollection(userId: string) {
        this.loading = true;
        this.collectionService.getMyCollection(userId).subscribe({
            next: (data) => {
                this.collection = data;
                this.loading = false;
            },
            error: (err) => {
                console.error('Erreur récupération collection', err);
                this.loading = false;
            }
        });
    }

}