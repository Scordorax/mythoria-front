import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CardModel } from '../../models/card.model';
import { CardService } from '../../services/card.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { BoosterService } from '../../services/booster.service';
import { CollectionService } from '../../services/collection.service';
import { DeckService } from '../../services/deck.service';
import { UserModelService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { CardDetailComponent } from "./card-detail.component";

declare var bootstrap: any;

@Component({
  selector: 'app-cards-list',
  standalone: true,
  imports: [CommonModule, CardDetailComponent],
  templateUrl: './card-list.component.html',
  styles: [`
.pokemon-card {
  background: linear-gradient(135deg, #1d68b3, #e9ecef);
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
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
.pokemon-card {
  background: linear-gradient(135deg, #1d68b3, #e9ecef);
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  padding: 1rem;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0,0,0,0.3);
  }

  .card-header {
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-body {
    margin-top: 0.5rem;
  }

  .card-footer {
    margin-top: 0.5rem;
  }
}

/* Modal personnalisé */
.modal-custom {
  border-radius: 12px;
}
`]
})
export class CardsListComponent implements OnInit {

  cards: CardModel[] = [];
  loading = true;
  userId!: string;

  totalCards = 0;
  totalDecks = 0;
  totalBoosters = 0;
  totalCollectionCards = 0;

  selectedCard?: CardModel;

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
      this.loadDashboardStats();
      this.loadCards();
    });
  }

  private loadDashboardStats(): void {
    this.deckService.getByUser(this.userId).subscribe(decks => {
      this.totalDecks = decks.length;
      this.cdr.detectChanges();
    });

    this.boosterService.getAll().subscribe(boosters => {
      this.totalBoosters = boosters.length;
      this.cdr.detectChanges();
    });

    this.collectionService.getMyCollection(this.userId).subscribe(collection => {
      this.totalCollectionCards = collection.reduce((total, item) => total + item.quantity, 0);
      this.cdr.detectChanges();
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  loadCards(): void {
    this.cardService.getAll().subscribe({
      next: data => {
        this.cards = data;
        this.totalCards = data.length;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Erreur récupération cartes', err);
        this.loading = false;
      }
    });
  }

  selectCard(card: CardModel) {
    this.selectedCard = card;

    // Forcer Angular à détecter le changement
    this.cdr.detectChanges();

    // Ouvrir la modal après que le DOM est rendu
    setTimeout(() => {
      const modalEl = document.getElementById('cardModal');
      if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      }
    }, 0);
  }

  getTypeColor(type?: string): string {
    if (!type) return '#ffffff';
    switch (type.toLowerCase()) {
      case 'feu': return '#FF4500';
      case 'eau': return '#1E90FF';
      case 'plante': return '#32CD32';
      case 'électrik': return '#FFD700';
      case 'combat': return '#8B0000';
      case 'psy': return '#9400D3';
      case 'glace': return '#00FFFF';
      case 'dragon': return '#8A2BE2';
      default: return '#888888';
    }
  }
}