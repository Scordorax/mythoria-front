import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoaderService } from '../../services/loader.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  loading = false;

  // 🔹 Injecter les services Loader et Toast
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService,
    private toastService: ToastService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.loginForm.invalid) return;

    this.errorMessage = null;
    this.loaderService.show(); // afficher loader

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res: any) => {
        this.loaderService.hide(); // cacher loader
        if (res.token) {
          this.authService.setToken(res.token);
          this.toastService.show('Connexion réussie !');
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = 'Email ou mot de passe incorrect';
          this.toastService.show(this.errorMessage);
        }
      },
      error: (err) => {
        this.loaderService.hide(); // cacher loader
        if (err.status === 401) {
          this.errorMessage = 'Email ou mot de passe incorrect';
        } else {
          this.errorMessage = 'Erreur de connexion, réessayez plus tard';
        }
        this.toastService.show(this.errorMessage); // afficher toast
      }
    });
  }
}