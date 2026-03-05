import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import * as THREE from 'three';
import { BoosterModel } from '../../models/booster.model';
import { BoosterService } from '../../services/booster.service';
import { UserModelService } from '../../services/user.service';
import { BoosterOpenComponent } from './booster-open.component';

interface Booster3D {
  renderer: THREE.WebGLRenderer;
  animateId: number;
}

@Component({
  selector: 'app-booster-list',
  standalone: true,
  imports: [CommonModule, BoosterOpenComponent],
  templateUrl: './booster-list.component.html',
  styles: [`
.booster-list-container { margin-top: 30px; }

.booster-scroll {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
  cursor: grab;
  width: calc(5 * 240px + 4 * 20px);
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.booster-scroll::-webkit-scrollbar { display: none; }
.booster-scroll.active { cursor: grabbing; user-select: none; }

.booster-card {
  flex: 0 0 auto;
  width: 240px;
  background: linear-gradient(135deg, #fbbf24, #f97316);
  border-radius: 15px;
  text-align: center;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}

.booster-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 15px rgba(0,0,0,0.5);
}

.booster-3d { width: 100%; height: 180px; }
h6,p{ margin:5px 0; }
  `]
})
export class BoosterListComponent implements OnInit, AfterViewInit, OnDestroy {

  boosters: BoosterModel[] = [];
  userId!: string;

  @ViewChildren('boosterCanvas') boosterCanvases!: QueryList<ElementRef>;
  @ViewChild(BoosterOpenComponent) boosterOpenComponent!: BoosterOpenComponent;

  // Track 3D renderers
  booster3Ds: Booster3D[] = [];

  // Drag
  isDown = false;
  startX = 0;
  scrollLeft = 0;

  constructor(
    private boosterService: BoosterService,
    private userService: UserModelService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      this.userId = user.sub;

      this.boosterService.getAll().subscribe(data => {
        this.boosters = data;
      });
    });
  }

  ngAfterViewInit(): void {
    // Quand les canvases sont rendus, créer le 3D
    this.boosterCanvases.changes.subscribe(() => {
      this.destroyAllBoosters3D();
      this.boosterCanvases.forEach((canvasRef, index) => {
        const booster = this.boosters[index];
        if (canvasRef && booster) {
          const booster3D = this.createBooster3D(canvasRef.nativeElement, booster.name);
          this.booster3Ds.push(booster3D);
        }
      });
    });

    // Créer le 3D initialement si les canvases existent
    setTimeout(() => {
      this.destroyAllBoosters3D();
      this.boosterCanvases.forEach((canvasRef, index) => {
        const booster = this.boosters[index];
        if (canvasRef && booster) {
          const booster3D = this.createBooster3D(canvasRef.nativeElement, booster.name);
          this.booster3Ds.push(booster3D);
        }
      });
    }, 0);
  }

  ngOnDestroy() {
    this.destroyAllBoosters3D();
  }

  // --- Ouvrir modal de l'enfant ---
  openBoosterModal(booster: BoosterModel) {
    if (this.boosterOpenComponent) {
      this.boosterOpenComponent.openModal(booster.name);
    }
  }

  // --- Drag horizontal ---
  onMouseDown(event: MouseEvent) {
    this.isDown = true;
    const container = event.currentTarget as HTMLElement;
    this.startX = event.pageX - container.offsetLeft;
    this.scrollLeft = container.scrollLeft;
    container.classList.add('active');
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDown) return;
    event.preventDefault();
    const container = event.currentTarget as HTMLElement;
    const x = event.pageX - container.offsetLeft;
    const walk = (x - this.startX) * 2;
    container.scrollLeft = this.scrollLeft - walk;
  }

  onMouseUp() {
    this.isDown = false;
    document.querySelectorAll('.booster-scroll').forEach(el => el.classList.remove('active'));
  }

  // --- Couleur selon le booster ---
  getBoosterColor(name: string): number {
    const colors: any = {
      "Booster Flamme": 0xff4500,
      "Booster Aqua": 0x1e90ff,
      "Booster Éclair": 0xffff00,
      "Booster Terre": 0x8b4513,
      "Booster Vent": 0xd3d3d3,
      "Booster Foudre": 0xffd700,
      "Booster Eau": 0x00bfff,
      "Booster Feu": 0xff0000,
      "Booster Plante": 0x32cd32,
      "Booster Roche": 0x696969
    };
    return colors[name] || 0xffffff;
  }

  // --- Création booster 3D ---
  createBooster3D(container: HTMLElement, boosterName: string): Booster3D {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x1e1e1e); // fond sombre comme dashboard
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    const directional = new THREE.DirectionalLight(0xffffff, 1);
    directional.position.set(5, 5, 5);
    scene.add(ambient, directional);

    const geometry = new THREE.BoxGeometry(1.4, 2, 0.15);
    const material = new THREE.MeshStandardMaterial({
      color: this.getBoosterColor(boosterName),
      metalness: 0.6,
      roughness: 0.3
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animateId = 0;
    const animate = () => {
      animateId = requestAnimationFrame(animate);
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    return { renderer, animateId };
  }

  destroyAllBoosters3D() {
    this.booster3Ds.forEach(b => {
      cancelAnimationFrame(b.animateId);
      b.renderer.dispose();
      const parent = b.renderer.domElement.parentElement;
      if (parent) parent.removeChild(b.renderer.domElement);
    });
    this.booster3Ds = [];
  }

}