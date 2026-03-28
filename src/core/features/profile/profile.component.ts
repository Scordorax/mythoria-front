import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserModel } from '../../models/user.model';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { RarityPipe } from '../../shared/pipes/rarity.pipe';

import { AuthService } from '../../services/auth.service';
import { CardService } from '../../services/card.service';
import { DeckService } from '../../services/deck.service';
import { CollectionService } from '../../services/collection.service';
import { UserModelService } from '../../services/user.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, TruncatePipe],
  templateUrl: './profile.component.html',
  styles: [`
    .profile-container {
      padding: 2rem;
      color: white;
    }

    .profile-card {
      background: #1e1e2f;
      padding: 2rem;
      border-radius: 12px;
      text-align: center;
      margin-bottom: 2rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    }

    .avatar {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #6a00ff, #007bff);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      margin: 0 auto 1rem;
    }

    .roles {
      margin-top: 1rem;
    }

    .role-badge {
      background: #6a00ff;
      padding: 5px 10px;
      border-radius: 8px;
      margin: 0 5px;
      font-size: 0.8rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }

    .stat-card {
      background: #2a2a3d;
      padding: 1.5rem;
      border-radius: 10px;
      text-align: center;
    }

    .logout-btn {
      margin-top: 2rem;
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      background: #ff4d4d;
      color: white;
      cursor: pointer;
    }

    .logout-btn:hover {
      opacity: 0.9;
    }

    .loading {
      padding: 2rem;
      text-align: center;
    }
  `]
})
export class ProfileComponent implements OnInit {

  user!: UserModel;

  totalCards = 0;
  totalDecks = 0;
  totalCollectionCards = 0;

  loading = true;

  constructor(
    private userService: UserModelService,
    private authService: AuthService,
    private cardService: CardService,
    private deckService: DeckService,
    private collectionService: CollectionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const userId = this.authService.getUserId();

    if (!userId) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loadProfile(userId);
  }

  private loadProfile(userId: string): void {

    this.userService.getCurrentUser().subscribe(user => {
      this.user = user;

      forkJoin({
        cards: this.cardService.getAll(),
        decks: this.deckService.getByUser(userId),
        collection: this.collectionService.getMyCollection(userId)
      }).subscribe({
        next: (result) => {

          this.totalCards = result.cards.length;
          this.totalDecks = result.decks.length;

          this.totalCollectionCards = result.collection.reduce(
            (total, item) => total + item.quantity,
            0
          );

          this.loading = false;

          // 🔥 FORCE UPDATE COMME TON AUTRE COMPOSANT
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur chargement profil', err);
          this.loading = false;

          // 🔥 aussi ici
          this.cdr.detectChanges();
        }
      });

    });
  }

  logout(): void {
    this.authService.logout();
  }

}