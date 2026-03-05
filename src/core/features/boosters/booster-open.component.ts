import { AfterViewInit, Component, ElementRef, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BoosterModel } from '../../models/booster.model';
import { BoosterService } from '../../services/booster.service';
import * as THREE from 'three';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserModelService } from '../../services/user.service';

interface Booster3D {
    renderer: THREE.WebGLRenderer;
    animateId: number;
}

@Component({
    selector: 'app-booster-open',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './booster-open.component.html',
    styles: [`
    .booster-open-container {
      position: relative;
      width: 600px;
      height: 300px;
      margin: 0 auto;
      overflow: hidden;
      cursor: grab;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .booster-open-container.active {
      cursor: grabbing;
      user-select: none;
    }

    .booster-circle {
      width: 150px;
      height: 200px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      background: linear-gradient(135deg, #fbbf24, #f97316);
      box-shadow: 0 4px 10px rgba(0,0,0,0.5);
      transition: transform 0.3s, opacity 0.3s;
      cursor: pointer;
      z-index: 1;
    }

    .booster-circle.center {
      z-index: 10;
      transform: translate(-50%, -50%) scale(1.2) rotateY(0deg);
    }

    .booster-circle.side {
      z-index: 5;
      opacity: 0.5;
    }

    .booster-3d {
      width: 100px;
      height: 120px;
    }

    .booster-circle p {
      margin-top: 5px;
      text-align: center;
      font-weight: bold;
      color: white;
    }

    .modal-content {
      background-color: #1e1e1e;
      color: white;
    }

    .modal-header, .modal-footer { border: none; }
    .btn-close-white { filter: invert(1); }
  `]
})
export class BoosterOpenComponent implements AfterViewInit, OnDestroy {

    @ViewChild('boosterModal', { static: true }) boosterModalRef!: ElementRef;
    @ViewChildren('boosterCanvas') boosterCanvases!: QueryList<ElementRef>;

    modalInstance: any;
    boostersOfType: BoosterModel[] = [];
    selectedType = '';
    centerIndex = 0;
    userId!: any;

    // Track renderers to properly dispose
    booster3Ds: Booster3D[] = [];

    // Drag
    isDown = false;
    startX = 0;

    constructor(private boosterService: BoosterService, private router: Router, private userService: UserModelService) { }

    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe(user => {
            this.userId = user.sub;
        });
    }

    ngAfterViewInit() {
        // @ts-ignore
        this.modalInstance = new (window as any).bootstrap.Modal(this.boosterModalRef.nativeElement);

        this.boosterModalRef.nativeElement.addEventListener('shown.bs.modal', () => {
            this.createAllBoosters3D();
            this.positionBoosters();
        });

        this.boosterModalRef.nativeElement.addEventListener('hidden.bs.modal', () => {
            this.destroyAllBoosters3D();
        });
    }

    openModal(type: string) {
        this.selectedType = type;
        this.boosterService.getAll().subscribe(all => {
            const boosters = all.filter(b => b.name === type);
            this.boostersOfType = [];
            while (this.boostersOfType.length < 10) {
                for (let b of boosters) {
                    if (this.boostersOfType.length < 10) this.boostersOfType.push(b);
                    else break;
                }
            }
            this.centerIndex = 0;
            this.modalInstance.show();
        });
    }

    positionBoosters() {
        const spacing = 180;
        this.boosterCanvases.forEach((canvasRef, i) => {
            const parent = canvasRef.nativeElement.parentElement as HTMLElement;
            const offset = (i - this.centerIndex) * spacing;
            parent.style.left = `calc(50% + ${offset}px)`;
            parent.style.opacity = (i === this.centerIndex ? '1' : '0.5');
            parent.classList.toggle('center', i === this.centerIndex);
            parent.classList.toggle('side', i !== this.centerIndex);
            const angle = (i - this.centerIndex) * 20;
            parent.style.transform = `translate(-50%, -50%) scale(${i === this.centerIndex ? 1.2 : 0.9}) rotateY(${angle}deg)`;
        });
    }

    onMouseDown(event: MouseEvent) {
        this.isDown = true;
        this.startX = event.pageX;
        this.boosterModalRef.nativeElement.querySelector('.booster-open-container').classList.add('active');
    }

    onMouseMove(event: MouseEvent) {
        if (!this.isDown) return;
        const dx = event.pageX - this.startX;
        if (dx > 20 && this.centerIndex > 0) {
            this.centerIndex--;
            this.startX = event.pageX;
            this.positionBoosters();
        }
        if (dx < -20 && this.centerIndex < this.boostersOfType.length - 1) {
            this.centerIndex++;
            this.startX = event.pageX;
            this.positionBoosters();
        }
    }

    onMouseUp() {
        this.isDown = false;
        this.boosterModalRef.nativeElement.querySelector('.booster-open-container').classList.remove('active');
    }

    openSingleBooster(booster: BoosterModel) {
        // Utilise l'ID réel de l'utilisateur
        this.boosterService.openBooster(this.userId, booster.id).subscribe(res => {
            alert(`Vous avez ouvert "${booster.name}" et reçu ${res.cardsReceived} cartes !`);
            this.modalInstance.hide();
            this.router.navigate(['/collection']);
        });
    }

    createAllBoosters3D() {
        this.destroyAllBoosters3D(); // cleanup if existing

        this.boosterCanvases.forEach((canvasRef, index) => {
            const booster = this.boostersOfType[index];
            if (booster) {
                const booster3D = this.createBooster3D(canvasRef.nativeElement, booster.name);
                this.booster3Ds.push(booster3D);
            }
        });
    }

    createBooster3D(container: HTMLElement, boosterName: string): Booster3D {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 4;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x1e1e1e); // Dashboard-like dark
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

    ngOnDestroy() {
        this.destroyAllBoosters3D();
    }
}