import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Match } from '../../models/match.model';
import { MatchService } from '../../services/match.service';
import { CardModel } from '../../models/card.model';
import { MatchPlayer } from '../../models/match-player.model';
import { UserModelService } from '../../services/user.service';

@Component({
    standalone: true,
    selector: 'app-match-game',
    imports: [CommonModule, FormsModule],
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
    justify-content: space-between;
    background: #1e293b;
    padding: 15px;
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
    width: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.cards {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.cards div {
    width: 100px;
    background: #334155;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
}

.card-back {
    width: 100px;
    height: 120px;
    background: #020617;
    border: 2px solid #334155;
    display: flex;
    justify-content: center;
    align-items: center;
}

.dead {
    opacity: 0.4;
}

.error {
    color: red;
    font-weight: bold;
}
    `]
})
export class MatchGameComponent implements OnInit {

    matchId!: number;
    userId!: number;

    match: Match | null = null;
    loading = false;
    error: string | null = null;

    currentTurn: 'PLAYER' | 'AI' = 'PLAYER';
    isAttacking = false;

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

                // sécurité
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
        this.matchService.drawCard(this.matchId, this.userId).subscribe({
            next: () => this.loadMatch(),
            error: () => this.error = 'Erreur pioche'
        });
    }

    playCard(card: CardModel): void {
        this.matchService.playCard(this.matchId, this.userId, card.id)
            .subscribe({
                next: () => this.loadMatch(),
                error: () => this.error = 'Erreur lors du play'
            });
    }

    // =========================
    // 🔥 ATTAQUE JOUEUR
    // =========================
    attackCard(attacker: CardModel, target: CardModel | null): void {

        if (this.currentTurn !== 'PLAYER') return;

        this.isAttacking = true;

        setTimeout(() => {

            if (!this.player || !this.opponent) return;

            const damage = attacker.attack;

            if (target) {

                target.hp -= damage;

                // 💀 mort de la carte
                if (target.hp <= 0) {

                    const overflow = Math.abs(target.hp);

                    this.opponent.deadCards.push(target);
                    this.opponent.activeCard = null;

                    // 🔥 overflow sur le joueur adverse
                    this.opponent.lifePoints -= overflow;
                }

            } else {
                this.opponent.lifePoints -= damage;
            }

            this.isAttacking = false;

            this.checkEndGame();
            this.endTurn();

        }, 400);
    }

    // =========================
    // 🔁 TOUR IA
    // =========================
    endTurn(): void {
        this.currentTurn = 'AI';

        setTimeout(() => this.aiTurn(), 800);
    }

    aiTurn(): void {

        if (!this.player || !this.opponent) return;

        const attacker = this.opponent.activeCard;

        if (!attacker) {
            this.currentTurn = 'PLAYER';
            return;
        }

        const target = this.player.activeCard ?? null;

        this.isAttacking = true;

        setTimeout(() => {

            const damage = attacker.attack;

            if (target) {

                target.hp -= damage;

                if (target.hp <= 0) {

                    const overflow = Math.abs(target.hp);

                    this.player!.deadCards.push(target);
                    this.player!.activeCard = null;

                    this.player!.lifePoints -= overflow;
                }

            } else {
                this.player!.lifePoints -= damage;
            }

            this.isAttacking = false;

            this.checkEndGame();

            this.currentTurn = 'PLAYER';

        }, 400);
    }

    // =========================
    // 🏁 FIN DE PARTIE
    // =========================
    checkEndGame(): void {

        if (!this.player || !this.opponent) return;

        if (this.player.lifePoints <= 0) {
            alert('💀 Défaite');
        }

        if (this.opponent.lifePoints <= 0) {
            alert('🏆 Victoire');
        }
    }

    // =========================
    // 👤 GETTERS
    // =========================
    get player(): MatchPlayer | null {
        return this.match?.players?.find(p => p.userId === this.userId) ?? null;
    }

    get opponent(): MatchPlayer | null {
        return this.match?.players?.find(p => p.userId !== this.userId) ?? null;
    }
}