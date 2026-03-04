import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

import { AuthService } from '../../services/auth.service';
import { BoosterService } from '../../services/booster.service';
import { CardService } from '../../services/card.service';
import { CollectionService } from '../../services/collection.service';
import { DeckService } from '../../services/deck.service';
import { BoosterListComponent } from "../boosters/booster-list.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    NavbarComponent,
    BoosterListComponent
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

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
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadDashboardStats();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  private loadDashboardStats(): void {
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

    this.collectionService.getMyCollection().subscribe(collection => {
      this.totalCollectionCards = collection.reduce(
        (total, item) => total + item.quantity,
        0
      );
      this.cdr.detectChanges();
    });
  }

}