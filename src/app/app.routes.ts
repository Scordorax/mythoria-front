import { Routes } from '@angular/router';
import { LoginComponent } from '../core/features/auth/login.component';
import { RegisterComponent } from '../core/features/auth/register.component';
import { DashboardComponent } from '../core/features/dashboard/dashboard.component';
import { authGuard } from '../core/guards/auth.guard';
import { CollectionComponent } from '../core/features/collection/collection.component';
import { CardsListComponent } from '../core/features/cards/card-list.component';
import { ProfileComponent } from '../core/features/profile/profile.component';
import { DeckListComponent } from '../core/features/decks/deck-list.component';
import { DeckBuilderComponent } from '../core/features/decks/deck-builder.component';
import { DeckDetailComponent } from '../core/features/decks/deck-detail.component';
import { DeckModifyComponent } from '../core/features/decks/deck-modify.component';

export const routes: Routes = [

  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/register', component: RegisterComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },

  { path: 'collection', component: CollectionComponent, canActivate: [authGuard] },

  { path: 'cards', component: CardsListComponent, canActivate: [authGuard] },

  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },

  // Routes Deck
  {
    path: 'decks',
    canActivate: [authGuard],
    children: [
      { path: '', component: DeckListComponent },
      { path: 'builder', component: DeckBuilderComponent },
      { path: 'modify/:userId/:deckId', component: DeckModifyComponent },
      { path: ':userId/:deckId', component: DeckDetailComponent }
    ]
  },

  // Redirection par défaut → Login
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // Fallback pour routes inconnues
  { path: '**', redirectTo: 'auth/login' }

];
