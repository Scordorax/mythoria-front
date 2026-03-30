import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Match } from '../../models/match.model';
import { MatchFactory } from '../../factories/match.factory';
import { MatchService } from '../../services/match.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    imports: [CommonModule, FormsModule],
    selector: 'app-match-game',
    templateUrl: './match-game.component.html',
    styles: [`:host {
  display: block;
  padding: 20px;
  background: #0f172a;
  color: white;
  min-height: 100vh;
}

h1, h2 {
  text-align: center;
}

.players {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.player {
  width: 45%;
  background: #1e293b;
  padding: 15px;
  border-radius: 12px;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.cards div {
  background: #334155;
  padding: 10px;
  border-radius: 8px;
  width: 120px;
  text-align: center;
  transition: 0.2s;
}

.cards div:hover {
  transform: scale(1.05);
  background: #475569;
}

button {
  margin-top: 10px;
  padding: 8px 12px;
  border: none;
  background: #22c55e;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background: #16a34a;
}`]
})
export class MatchGameComponent implements OnInit {

    match!: Match;
    matchId!: number;

    currentPlayerIndex = 0;
    loading = true;
    error: string | null = null;

    constructor(
        private route: ActivatedRoute,
        private matchService: MatchService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {

        this.loading = true;

        // 🔥 IMPORTANT (comme ton DeckList)
        this.route.paramMap.subscribe(params => {

            const id = params.get('id');

            if (!id) {
                this.error = "Match ID introuvable";
                this.loading = false;
                return;
            }

            this.matchId = Number(id);

            console.log("🎮 MATCH ID :", this.matchId);

            this.loadMatch();
        });
    }

    loadMatch(): void {

        this.matchService.getMatch(this.matchId).subscribe({

            next: (match) => {
                console.log("✅ MATCH :", match);

                this.match = match;
                this.loading = false;

                this.cdr.detectChanges(); // 🔥 comme DeckList
            },

            error: (err) => {
                console.error("❌ ERREUR MATCH :", err);

                this.error = "Erreur lors du chargement du match";
                this.loading = false;

                this.cdr.detectChanges();
            }
        });
    }

    /**
     * 🎯 Jouer une carte
     */
    playCard(cardId: number): void {

        if (this.currentPlayerIndex !== 0) return;

        this.matchService.playCard(this.matchId, cardId).subscribe({
            next: () => {
                this.loadMatch(); // 🔥 reload état
                this.nextTurn();
            },
            error: (err) => console.error(err)
        });
    }

    /**
     * ⏭️ Fin tour
     */
    endTurn(): void {
        this.nextTurn();
    }

    /**
     * 🔄 Tour suivant
     */
    nextTurn(): void {

        this.currentPlayerIndex = this.currentPlayerIndex === 0 ? 1 : 0;

        if (this.currentPlayerIndex === 1) {
            this.handleAI();
        }
    }

    /**
     * 🤖 IA
     */
    handleAI(): void {

        const ai = this.match.players[1];

        if (!ai.hand.length) {
            this.nextTurn();
            return;
        }

        const randomCard = ai.hand[Math.floor(Math.random() * ai.hand.length)];

        this.matchService.playCard(this.matchId, randomCard.id).subscribe({
            next: () => {
                this.loadMatch();
                this.nextTurn();
            },
            error: (err) => console.error(err)
        });
    }
}