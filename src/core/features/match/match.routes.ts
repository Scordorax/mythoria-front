import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { MatchLobbyComponent } from './match-lobby.component';
import { MatchGameComponent } from './match-game.component';


export const MATCH_ROUTES: Routes = [
  {
    path: 'match-lobby',
    component: MatchLobbyComponent,
    canActivate: [authGuard]
  },

  {
    path: 'match-game/:id',
    component: MatchGameComponent ,
    canActivate: [authGuard]
  }
];