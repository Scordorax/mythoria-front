import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserModelService } from '../../services/user.service';
import { DeckService } from '../../services/deck.service';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule],
    selector: 'app-match-lobby',
    templateUrl: './match-lobby.component.html',
    styles: [`.lobby-container {
  max-width: 600px;
  margin: auto;
  text-align: center;
  padding: 2rem;
}

.section {
  margin: 2rem 0;
}

.difficulty-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: #2c2c2c;
  color: white;
  transition: 0.3s;
}

button:hover {
  background: #444;
}

button.active {
  background: #007bff;
}

.start-button {
  background: #28a745;
  font-size: 18px;
}

.start-button:hover {
  background: #218838;
}

.error {
  color: red;
  margin-top: 1rem;
}
.deck-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.deck-card {
  padding: 15px;
  border-radius: 10px;
  background: #2c2c2c;
  cursor: pointer;
  min-width: 150px;
  transition: 0.3s;
}

.deck-card:hover {
  background: #444;
}

.deck-card.selected {
  border: 2px solid #007bff;
  background: #1f3a5f;
}`]
})
export class MatchLobbyComponent {

    difficulty: string = 'easy';
    loading: boolean = false;
    error: string | null = null;
    userId!: any;
    decks: any[] = [];
    selectedDeck: any = null;
    totalDecks: number = 0;

    constructor(
        private matchService: MatchService,
        private router: Router,
        private userService: UserModelService,
        private deckService: DeckService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe(user => {
            this.userId = Number(user.sub);
            this.loadDecks();
            console.log(this.userId)
        })
    }

    loadDecks(): void {
        this.deckService.getByUser(this.userId).subscribe({
            next: (data) => {
                this.decks = data;
                this.totalDecks = this.decks.length;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Erreur récupération decks', err);
            }
        });
    }

    selectDeck(deck: any): void {
        this.selectedDeck = deck;
    }

    /**
     * 🎮 Lancer un match
     */
    createMatch(): void {
        this.loading = true;
        this.error = null;
        

        if (!this.selectedDeck) {
            this.error = "⚠️ Veuillez sélectionner un deck";
            this.loading = false;
            return;
        }
        console.log(this.userId)

        this.matchService.createMatch(this.userId, this.selectedDeck.deckId).subscribe({
            next: (matchId: number) => {
                this.router.navigate(['/match-game', matchId]);
            },
            error: (err) => {
                console.error(err);
                this.error = 'Erreur lors de la création du match';
                this.loading = false;
            }
        });
    }

    /**
     * 🎯 Changer difficulté
     */
    selectDifficulty(level: string): void {
        this.difficulty = level;
    }
}