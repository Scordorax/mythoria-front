import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { CardsListComponent } from './card-list.component';

export const collectionRoutes: Routes = [
  {
    path: 'cards',
    component: CardsListComponent,
    canActivate: [authGuard]
  }
];