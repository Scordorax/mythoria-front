import { Component, OnInit } from '@angular/core';
import { BoosterService } from '../../services/booster.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BoosterModel } from '../../models/booster.model';

@Component({
    selector: 'app-booster-list',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    templateUrl: './booster-list.component.html',
    styles:
        `.booster-list-container {
  h4 {
    font-weight: bold;
  }
}

.booster-scroll {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 10px;

  /* Scrollbar personnalisée */
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #6b7280;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

.booster-card {
  flex: 0 0 auto;
  width: calc((100% - 80px) / 5); /* Affiche 5 boosters visibles à la fois */
  background: linear-gradient(135deg, #fbbf24, #f97316);
  border-radius: 15px;
  text-align: center;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 15px rgba(0,0,0,0.5);
  }

  .booster-image {
    width: 100%;
    padding-top: 100%; /* carré parfait */
    position: relative;
    overflow: hidden;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain; /* conserve le booster sans fond */
    }
  }

  h6, p {
    margin: 5px 0;
    font-weight: bold;
  }

  button {
    margin-top: 5px;
    font-size: 0.85rem;
  }
}`

})
export class BoosterListComponent implements OnInit {

    boosters: any[] = [];

    constructor(private boosterService: BoosterService) { }

    ngOnInit(): void {
        // 🔹 Ici on charge automatiquement les boosters dès que le composant est créé
        this.boosterService.getAll().subscribe((data) => {
            this.boosters = data;
        });
    }

    openBooster(booster: any) {
        this.boosterService.openBooster(booster.id).subscribe((res) => {
            alert(`Vous avez ouvert le booster "${booster.name}" et reçu ${res.cardsReceived} cartes !`);
        });
    }
}