import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styles: `.sidebar {
    width: 80px;
    background-color: #1f2937;
    min-height: 100vh;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: width 0.3s;
  }

  .sidebar:hover {
    width: 240px;
  }

  .nav-link {
    color: white;
    padding: 10px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    transition: background 0.2s;
  }

  .nav-link:hover {
    background-color: #374151;
  }

  .link-text {
    display: none;
  }

  .sidebar:hover .link-text {
    display: inline;
  }

  .logo-img {
    width: 40px;
  }

  .user-section .avatar {
    width: 40px;
    border-radius: 50%;
  }
`

})
export class SidebarComponent {
  menuItems = [
    { label: 'Cartes', link: '/cards', icon: 'bi bi-card-text' },
    { label: 'Decks', link: '/decks', icon: 'bi bi-stack' },
    { label: 'Boosters', link: '/dashboard', icon: 'bi bi-box' },
    { label: 'Collection', link: '/collection', icon: 'bi bi-folder' }
  ];
}