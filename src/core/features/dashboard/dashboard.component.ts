import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../services/auth.service';
import { BoosterService } from '../../services/booster.service';
import { CardService } from '../../services/card.service';
import { CollectionService } from '../../services/collection.service';
import { DeckService } from '../../services/deck.service';
import { BoosterListComponent } from "../boosters/booster-list.component";
import { UserModelService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BoosterListComponent
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  totalCards = 0;
  totalDecks = 0;
  totalBoosters = 0;
  totalCollectionCards = 0;

  loading = true;

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

    const userId = this.authService.getUserId();

    if (!userId) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loadDashboardStats(userId);

  }

  private loadDashboardStats(userId: string): void {

    this.loading = true;

    forkJoin({
      cards: this.cardService.getAll(),
      decks: this.deckService.getByUser(userId),
      boosters: this.boosterService.getAll(),
      collection: this.collectionService.getMyCollection(userId)
    }).subscribe(({ cards, decks, boosters, collection }) => {

      this.totalCards = cards.length;
      this.totalDecks = decks.length;
      this.totalBoosters = boosters.length;

      this.totalCollectionCards = collection.reduce(
        (total, item) => total + item.quantity,
        0
      );

      this.loading = false;

      this.cdr.detectChanges();
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

}