import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

import { Observable } from 'rxjs';
import { LoaderService } from '../core/services/loader.service';
import { ToastService } from '../core/services/toast.service';
import { LoaderComponent } from '../core/shared/components/loader/loader.component';
import { ToastComponent } from '../core/shared/components/toast/toast.component';
import { SidebarComponent } from "../core/shared/components/sidebar/sidebar.component";
import { NavbarComponent } from "../core/shared/components/navbar/navbar.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoaderComponent, ToastComponent, SidebarComponent, NavbarComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  isLoading$: Observable<boolean>;
  showToast$: Observable<boolean>;

  constructor(
    private loaderService: LoaderService,
    public toastService: ToastService,
    public router: Router
  ) {
    // 🔹 Assure-toi que les observables existent
    this.isLoading$ = this.loaderService.isLoading$;
    this.showToast$ = this.toastService.show$;
  }
  hideLayout(): boolean {
    return this.router.url.startsWith('/auth');
  }
}