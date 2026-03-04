import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { Observable } from 'rxjs';
import { LoaderService } from '../core/services/loader.service';
import { ToastService } from '../core/services/toast.service';
import { LoaderComponent } from '../core/shared/components/loader/loader.component';
import { ToastComponent } from '../core/shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoaderComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  isLoading$: Observable<boolean>;
  showToast$: Observable<boolean>;

  constructor(
    private loaderService: LoaderService,
    public toastService: ToastService
  ) {
    // 🔹 Assure-toi que les observables existent
    this.isLoading$ = this.loaderService.isLoading$; 
    this.showToast$ = this.toastService.show$;
  }
}