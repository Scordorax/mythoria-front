import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styles: `.navbar {
  height: 60px;
  background-color: #111827;
  color: white;

  .logo-img { width: 40px; }

  .search-input {
    background-color: #1f2937;
    border: none;
    color: white;
    width: 200px;

    &::placeholder { color: #9ca3af; }
  }

  .navbar-right {
    .avatar { width: 40px; border-radius: 50%; }
    i { cursor: pointer; }
  }
}`
})
export class NavbarComponent { }