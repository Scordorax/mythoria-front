import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { CollectionComponent } from './collection.component';

export const collectionRoutes: Routes = [
  {
    path: 'collection',
    component: CollectionComponent,
    canActivate: [authGuard]
  }
];