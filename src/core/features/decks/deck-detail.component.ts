import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeckService } from '../../services/deck.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-deck-detail',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './deck-detail.component.html',
    styles: [`.pokemon-card {
  background: linear-gradient(135deg, #1d68b3, #e9ecef);
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  overflow: hidden;
  transition: transform 0.3s;
  cursor: pointer;
}

.pokemon-card:hover {
  transform: scale(1.05);
}

.pokemon-card .card-header {
  background: rgba(255,203,5,0.9);
  color: #2a75bb;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}

.pokemon-card .card-body {
  padding: 0.75rem;
}

.pokemon-card .card-body img {
  max-width: 100%;
  border-radius: 0.5rem;
  border: 2px solid #ddd;
}

.pokemon-card .card-body p {
  margin: 0.25rem 0;
  font-size: 0.85rem;
}

.pokemon-card .card-body .stats {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  flex-wrap: wrap;
}

.pokemon-card .card-footer {
  background: #2a75bb;
  color: white;
  font-weight: bold;
  padding: 0.5rem;
  text-align: center;
}

.pokemon-card .card-footer .quantity {
  font-size: 1rem;
}

.pokemon-card .badge {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  color: white;
}

.pokemon-card .badge.common { background-color: #6c757d; }
.pokemon-card .badge.uncommon { background-color: #28a745; }
.pokemon-card .badge.rare { background-color: #007bff; }
.pokemon-card .badge.epic { background-color: #6610f2; }
.pokemon-card .badge.legendary { background-color: #ffc107; color: #000; }

/* Responsive */
@media (max-width: 768px) {
  .pokemon-card .card-body .stats {
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
  }
}`]
})
export class DeckDetailComponent implements OnInit {

    userId!: string;
    deckId!: number;
    deck: any = { cards: [] };
    loading !: boolean

    constructor(
        private route: ActivatedRoute,
        private deckService: DeckService
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
                // ⚡ Normaliser deck et cartes
                this.deck = {
                    deckId: deck.deckId,
                    name: deck.name,
                    cards: deck.cards.map((c: any) => ({
                        ...c,
                        rarity: (c.rarity || 'Commun').trim()
                    }))
                };
                this.loading = false;
                console.log('Deck chargé :', this.deck);
            },
            error: (err) => {
                console.error('Erreur chargement deck', err);
                this.deck = { cards: [] };
                this.loading = false;
            }
        });
    }

    getRarityClass(rarity: string): string {
        const r = (rarity || 'commun').toLowerCase().trim();
        switch (r) {
            case 'commun': return 'common';
            case 'uncommon': return 'uncommon';
            case 'rare': return 'rare';
            case 'epic': return 'epic';
            case 'legendary': return 'legendary';
            default: return 'common';
        }
    }
}