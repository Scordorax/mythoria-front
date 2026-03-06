import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { DeckListComponent } from './deck-list.component';
import { DeckBuilderComponent } from './deck-builder.component';
import { DeckDetailComponent } from './deck-detail.component';
import { DeckModifyComponent } from './deck-modify.component';

export const deckRoutes: Routes = [
  {
    path: 'decks',
    canActivate: [authGuard],
    children: [
      { path: '', component: DeckListComponent },
      { path: 'builder', component: DeckBuilderComponent },
      { path: 'modify/:userId/:deckId', component: DeckModifyComponent },
      { path: ':userId/:deckId', component: DeckDetailComponent }
    ]
  }
];