import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth/auth.service';
import { ToastService } from '../../core/services/toast/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-black flex items-center justify-center py-12 px-6 relative font-sans overflow-y-auto">
      
      <div class="absolute inset-0 z-0">
        <div class="w-full h-full bg-[radial-gradient(circle_at_center,rgba(219,39,119,0.1)_0,black_80%)]"></div>
      </div>

      <div class="max-w-md w-full relative z-10 animate-fade-in">
        
        <div class="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl">
          
          <div class="mb-8">
            <a routerLink="/" class="inline-flex items-center gap-2 text-zinc-500 hover:text-pink-600 transition-colors text-sm font-bold uppercase tracking-widest group">
              <svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Volver al inicio
            </a>
          </div>

          <div class="text-center mb-10">
            <h2 class="text-3xl font-black tracking-widest text-white uppercase mb-2">
              GARAGE<span class="text-pink-600">23</span>AMG
            </h2>
            <p class="text-zinc-500 font-medium text-sm tracking-widest uppercase">Identifícate para continuar</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <div>
              <label class="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Email</label>
              <input type="email" formControlName="email" 
                class="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-600 transition-colors"
                placeholder="tu@email.com">
            </div>

            <div>
              <label class="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2 px-1">Contraseña</label>
              <input type="password" formControlName="contrasena" 
                class="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-600 transition-colors"
                placeholder="••••••••">
            </div>

            <button type="submit" [disabled]="loginForm.invalid || isLoading"
              class="w-full bg-pink-600 hover:bg-pink-700 text-white font-black py-4 rounded-xl shadow-lg shadow-pink-600/20 hover:shadow-pink-600/40 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm">
              <span *ngIf="!isLoading">Iniciar Sesión</span>
              <span *ngIf="isLoading" class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </span>
            </button>

            <p class="text-center text-zinc-500 text-sm font-medium mt-8">
              ¿No tienes cuenta? 
              <a routerLink="/registro" class="text-pink-600 hover:underline font-bold">Regístrate aquí</a>
            </p>

          </form>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isLoading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(4)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.authService.login(this.loginForm.value as any).subscribe({
        next: () => {
          this.toastService.show('¡Bienvenido de nuevo a Garage23AMG!', 'success');
          this.isLoading = false;
          const userRole = this.authService.currentUser()?.rol;
          if (userRole === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/client-dashboard']);
          }
        },
        error: () => {
          this.toastService.show('Email o contraseña incorrectos', 'error');
          this.isLoading = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}