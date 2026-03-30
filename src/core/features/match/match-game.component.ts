import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Match } from '../../models/match.model';
import { MatchService } from '../../services/match.service';
import { CardModel } from '../../models/card.model';
import { MatchPlayer } from '../../models/match-player.model';
import { UserModelService } from '../../services/user.service';

@Component({
    standalone: true,
    selector: 'app-match-game',
    imports: [CommonModule],
    templateUrl: './match-game.component.html',
    styles: [`
.match-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    background: #0f172a;
    color: white;
    min-height: 100vh;
}

.header {
    display: flex;
    align-items: center;
    gap: 20px;
    background: #1e293b;
    padding: 15px 20px;
    border-radius: 12px;
}

.battle-field {
    display: flex;
    gap: 20px;
}

.player-card {
    flex: 1;
    background: #1e293b;
    padding: 15px;
    border-radius: 12px;
}

.opponent {
    background: #0b2a3b;
}

.center {
    width: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
}

.active-zone {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 12px;
}

.cards {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 12px;
}

.card {
    width: 110px;
    background: #334155;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border 0.2s;
    font-size: 13px;
}

.card:hover {
    border-color: #60a5fa;
}

.card.selected {
    border-color: #facc15;
    background: #3b3a20;
}

.card.active-card {
    border-color: #f97316;
    background: #2d1a0a;
    cursor: default;
}

.card.dead {
    opacity: 0.4;
    cursor: default;
    font-size: 12px;
    padding: 6px;
    width: 80px;
}

.card-back {
    width: 110px;
    height: 120px;
    background: #020617;
    border: 2px solid #334155;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32px;
}

.empty-slot {
    width: 110px;
    height: 100px;
    border: 2px dashed #475569;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    font-size: 12px;
    text-align: center;
    padding: 6px;
}

.attack-btn {
    padding: 10px 20px;
    background: #dc2626;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 15px;
    font-weight: bold;
    transition: background 0.2s;
}

.attack-btn:hover {
    background: #b91c1c;
}

.draw-btn {
    padding: 8px 16px;
    background: #1d4ed8;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
}

.draw-btn:hover {
    background: #1e40af;
}

.draw-btn:disabled {
    background: #475569;
    cursor: not-allowed;
}

.error {
    color: #f87171;
    font-weight: bold;
    padding: 10px;
}

.end-screen {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    z-index: 100;
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    padding: 40px;
}

.end-screen.defeat {
    background: rgba(127, 0, 0, 0.92);
    color: #fff;
}

.end-screen.victory {
    background: rgba(0, 80, 0, 0.92);
    color: #fff;
}

.end-screen.draw {
    background: rgba(30, 41, 59, 0.92);
    color: #fff;
}

.end-screen h1 {
    font-size: 52px;
    margin: 0;
}

.end-screen p {
    font-size: 20px;
    color: rgba(255,255,255,0.8);
}

p { margin: 4px 0; }
h3 { margin: 0 0 8px 0; }
h4 { margin: 12px 0 6px 0; color: #94a3b8; font-size: 13px; }

.dead-badge {
    display: inline-block;
    background: #7f1d1d;
    color: #fca5a5;
    border-radius: 12px;
    padding: 1px 8px;
    font-size: 12px;
    font-weight: bold;
    margin-left: 6px;
}
    `]
})
export class MatchGameComponent implements OnInit {

    matchId!: number;
    userId!: number;

    match: Match | null = null;
    loading = false;
    error: string | null = null;

    selectedCard: CardModel | null = null;

    constructor(
        private matchService: MatchService,
        private route: ActivatedRoute,
        private userService: UserModelService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.matchId = Number(this.route.snapshot.paramMap.get('id'));
        this.userService.getCurrentUser().subscribe(user => {
            this.userId = Number(user.sub);
            this.loadMatch();
        });
    }

    loadMatch(): void {
        this.loading = true;
        this.matchService.getMatch(this.matchId).subscribe({
            next: (res) => {
                res.players.forEach(p => {
                    p.deadCards = p.deadCards || [];
                });
                this.match = res;
                this.loading = false;
                this.cdr.detectChanges();
            },
            error: () => {
                this.error = 'Erreur chargement match';
                this.loading = false;
            }
        });
    }

    drawCard(): void {
        this.error = null;
        this.matchService.drawCard(this.matchId, this.userId).subscribe({
            next: () => this.loadMatch(),
            error: (err) => this.error = err.error?.error || 'Erreur pioche'
        });
    }

    // Click a card in hand → preview it in the active slot
    selectCard(card: CardModel): void {
        this.selectedCard = card;
    }

    // Click Attack → play the selected card (backend handles attack + AI turn)
    attack(): void {
        if (!this.selectedCard) return;
        const cardId = this.selectedCard.id;
        this.selectedCard = null;
        this.error = null;

        this.matchService.playCard(this.matchId, this.userId, cardId).subscribe({
            next: () => this.loadMatch(),
            error: (err) => this.error = err.error?.error || 'Erreur lors de l\'attaque'
        });
    }

    // The card shown in the active slot: selected card (preview) or current active from server
    get activeDisplay(): CardModel | null {
        return this.selectedCard ?? this.player?.activeCard ?? null;
    }

    get isFinished(): boolean {
        return this.match?.status === 'finished';
    }

    get playerLost(): boolean {
        if (!this.player) return false;
        const noCards = (this.player.hand?.length ?? 0) === 0
            && (this.player.deckCount ?? 0) === 0
            && this.player.activeCard === null;
        return noCards || (this.player.lifePoints ?? 100) <= 0;
    }

    get opponentLost(): boolean {
        if (!this.opponent) return false;
        const noCards = (this.opponent.hand?.length ?? 0) === 0
            && (this.opponent.deckCount ?? 0) === 0
            && this.opponent.activeCard === null;
        return noCards || (this.opponent.lifePoints ?? 100) <= 0;
    }

    get player(): MatchPlayer | null {
        return this.match?.players?.find(p => p.userId === this.userId) ?? null;
    }

    get opponent(): MatchPlayer | null {
        return this.match?.players?.find(p => p.userId !== this.userId) ?? null;
    }
}
