import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private showSubject = new BehaviorSubject<boolean>(false);
  show$: Observable<boolean> = this.showSubject.asObservable();
  message: string = '';

  show(msg: string) {
    this.message = msg;
    this.showSubject.next(true);
    setTimeout(() => this.hide(), 3000);
  }

  hide() {
    this.showSubject.next(false);
    this.message = '';
  }
}